import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

export const name = 'dsh-leetcode-plugin'
export const inject = ['commands', 'tools']

// ---- 配置 ----
// vault 自动推导：插件与 vault（leetcode/）同仓库、互为兄弟目录。
// 插件通过 link: 链进 profile，Node 加载 ESM 时把 symlink 解析为真实路径，
// 因此 import.meta.url 指向仓库内的 index.js，上一级即仓库根，再进 leetcode/ 即 vault。
const VAULT = join(dirname(fileURLToPath(import.meta.url)), '..', 'leetcode')
const DEFAULT_BASE = 'https://leetcode.cn'

// ---- 插件配置 schema（零依赖：手写 standard-schema 协议，Cordis 在加载时校验并合并默认值） ----
export const Config = {
  ['~standard']: {
    version: 1,
    vendor: 'dsh-leetcode-plugin',
    validate(value) {
      const issues = []
      const raw = value && typeof value === 'object' && !Array.isArray(value) ? value : {}
      const out = {}

      const leetcodeBase = raw.leetcodeBase ?? DEFAULT_BASE
      if (typeof leetcodeBase !== 'string' || !/^https?:\/\//i.test(leetcodeBase.trim())) {
        issues.push({ message: 'leetcodeBase 必须是 http(s) 地址', path: ['leetcodeBase'] })
      } else {
        out.leetcodeBase = leetcodeBase.trim()
      }

      return issues.length ? { issues } : { value: out }
    },
  },
}

// 运行时配置（apply 里由已验证的 config 填充；无 config 时回落默认值）
let LEETCODE_BASE = DEFAULT_BASE

// vault 缺失时的报错信息（"没找到直接报错"，不静默回退）
const vaultError = () =>
  existsSync(VAULT)
    ? null
    : `vault 目录不存在：${VAULT}\n（插件从自身位置自动推导 vault = 同仓库的 leetcode/，请确认目录结构为 <仓库>/leetcode 与 <仓库>/dsh-leetcode-plugin 同级）`

// 本地时区日期（避免 UTC 在凌晨 0-8 点记成"昨天"）
const today = () => {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

const pad4 = (n) => String(n).padStart(4, '0')

const leetcodeUrl = (raw) => {
  const input = String(raw ?? '').trim()
  if (/^https?:\/\//i.test(input)) return input
  const n = input.replace(/\D/g, '')
  return n ? `${LEETCODE_BASE}/problemset/all/?search=${n}` : `${LEETCODE_BASE}/problemset/all/`
}

const textRender = (_args, value) => [{ type: 'text', text: value }]

// 内联 createUserMessage（等价 @deepseek-ai/dsh-llm 的实现：纯类型品牌，运行时就是 {content, source, role:'user', id}），保持零依赖
const createUserMessage = (input) => Object.freeze({ ...input, role: 'user', id: `lc-${crypto.randomUUID()}` })

// 按编号前缀找已有笔记：优先带 slug 的（LeetLog 英文，如 0001-two-sum.md），其次纯编号 0001.md
function findNoteByNumber(number) {
  const dir = join(VAULT, 'solutions')
  if (!existsSync(dir)) return undefined
  const prefix = pad4(number)
  const files = readdirSync(dir).filter((f) => f.endsWith('.md') && f.startsWith(prefix))
  if (files.length === 0) return undefined
  const slug = files.filter((f) => f.startsWith(prefix + '-')).sort()
  const bare = files.filter((f) => f === prefix + '.md')
  const chosen = slug[0] ?? bare[0] ?? files.sort()[0]
  return { file: join(dir, chosen), rel: `solutions/${chosen}` }
}

// 在 frontmatter 里设置/追加一个字段（不覆盖其他字段）
function setFrontmatterField(file, key, value) {
  const content = readFileSync(file, 'utf8')
  const re = new RegExp(`^(${key}: ).*$`, 'm')
  if (re.test(content)) {
    writeFileSync(file, content.replace(re, `$1${value}`), 'utf8')
    return
  }
  const m = content.match(/^---\n/m)
  if (!m) return
  const at = m.index + m[0].length
  writeFileSync(file, content.slice(0, at) + `${key}: ${value}\n` + content.slice(at), 'utf8')
}

// 追加一段 AI 辅助思路
function appendAiInsight(file, insight) {
  const content = readFileSync(file, 'utf8')
  const block = `\n- [${today()}] ${insight}\n`
  writeFileSync(file, content.includes('## AI 辅助思路')
    ? content.replace(/## AI 辅助思路\n/, `## AI 辅助思路\n${block}`)
    : `${content.replace(/\s+$/, '')}\n\n## AI 辅助思路\n${block}`, 'utf8')
}

// 无笔记时的兜底新建（LeetLog 风格最小笔记）
function createFallbackNote(number, title) {
  mkdirSync(join(VAULT, 'solutions'), { recursive: true })
  const rel = `solutions/${pad4(number)}.md`
  const file = join(VAULT, rel)
  if (!existsSync(file)) {
    writeFileSync(file, `---\nid: ${number}\ntitle: "${title ?? ''}"\nurl: ${leetcodeUrl(number)}\ndifficulty: \n---\n\n# ${number}. ${title ?? ''}\n`, 'utf8')
  }
  return { file, rel }
}

// ---- git 辅助（push / pull 命令共用） ----

// 从 start 目录向上找最近的 .git（vault 可能只是仓库里的一个子目录）
function findGitRoot(start) {
  let dir = start
  while (true) {
    if (existsSync(join(dir, '.git'))) return dir
    const parent = dirname(dir)
    if (parent === dir) return null
    dir = parent
  }
}

// 用 spawnSync 执行 git，避免 shell 转义问题（提交信息可含空格/特殊字符）
function runGit(cwd, args) {
  const r = spawnSync('git', args, { cwd, encoding: 'utf8' })
  return {
    ok: r.status === 0,
    code: r.status ?? 1,
    out: (r.stdout || '').trim(),
    err: (r.stderr || '').trim(),
  }
}

export function apply(ctx, config) {
  // 从 config schema 读取配置（Cordis 已校验并合并默认值；无 config 时回落默认值）
  LEETCODE_BASE = config?.leetcodeBase ?? DEFAULT_BASE

  // ---- /lc-fupan：触发 AI 复盘指定题目（命令 handler 通过 agent.steer 投递一条用户消息给模型） ----
  ctx.commands.register({
    name: 'lc-fupan',
    description: '复盘指定编号的 LeetCode 题：读取笔记 → AI 分析解法 → 写入复盘结果',
    input: { hint: '题目编号，如 26' },
    handler(inv) {
      const vaultErr = vaultError()
      if (vaultErr) return { kind: 'error', text: vaultErr }
      const number = String(inv.rawInput ?? '').trim().replace(/\D/g, '')
      if (!number) return { kind: 'error', text: '请提供题目编号，例如 /lc-fupan 26' }
      const found = findNoteByNumber(number)
      if (!found) return { kind: 'error', text: `第 ${number} 题还没有笔记（先在 LeetCode 刷完，LeetLog 会自动生成）` }
      const prompt = [
        `请复盘 LeetCode 第 ${number} 题。`,
        `1. 用 read 工具读取笔记文件（绝对路径）：${found.file}`,
        '2. 分析其中「我的解法」的代码：是否正确、是否最优、复杂度如何',
        `3. 调用 leetcode_record_note 工具（number=${number}），把 AI 辅助思路(insight)、复习状态(status)、时间复杂度(time)、空间复杂度(space) 写进笔记`,
        '4. 在回复里给出一段简洁的复盘总结（核心思路 + 复杂度 + 可改进点）',
      ].join('\n')
      inv.agent.steer(createUserMessage({ content: [{ type: 'text', text: prompt }], source: { kind: 'user' } }))
      return { kind: 'success', text: `已触发第 ${number} 题复盘，AI 正在分析…` }
    },
  })

  // ---- /lc-push：git add -A → commit（有变更才提交）→ push 到远端 ----
  ctx.commands.register({
    name: 'lc-push',
    description: '把本地刷题记录提交并推送到远端仓库（git add -A + commit + push）',
    input: { hint: '提交信息（可选），如 /lc-push 今日刷题' },
    handler(inv) {
      const vaultErr = vaultError()
      if (vaultErr) return { kind: 'error', text: vaultErr }
      const root = findGitRoot(VAULT)
      if (!root) return { kind: 'error', text: `未找到 git 仓库（从 ${VAULT} 向上查找 .git）` }

      const add = runGit(root, ['add', '-A'])
      if (!add.ok) return { kind: 'error', text: `git add 失败：${add.err}` }

      // --quiet：0 = 无变更，1 = 有变更，>1 = 出错
      const diff = runGit(root, ['diff', '--cached', '--quiet'])
      if (diff.code > 1) return { kind: 'error', text: `检查暂存区失败：${diff.err}` }

      const parts = []
      if (diff.code === 1) {
        const msg = String(inv.rawInput ?? '').trim() || `刷题记录 ${today()}`
        const commit = runGit(root, ['commit', '-m', msg])
        if (!commit.ok) return { kind: 'error', text: `git commit 失败：${commit.err}` }
        parts.push(commit.out)
      } else {
        parts.push('无新变更，跳过提交')
      }

      const branch = runGit(root, ['branch', '--show-current'])
      const b = branch.ok ? branch.out : ''
      if (!b) return { kind: 'error', text: '当前处于 detached HEAD，无法自动推送，请手动处理' }

      const push = runGit(root, ['push', '-u', 'origin', b])
      if (!push.ok) return { kind: 'error', text: `git push 失败：${push.err}` }
      parts.push(push.out || '已推送到远端')

      return { kind: 'success', text: parts.filter(Boolean).join('\n') }
    },
  })

  // ---- /lc-pull：从远端拉取最新（--ff-only 快进，避免产生 merge commit） ----
  ctx.commands.register({
    name: 'lc-pull',
    description: '从远端拉取最新（git pull --ff-only，快进合并，不产生 merge commit）',
    input: { hint: '无参数' },
    handler() {
      const vaultErr = vaultError()
      if (vaultErr) return { kind: 'error', text: vaultErr }
      const root = findGitRoot(VAULT)
      if (!root) return { kind: 'error', text: `未找到 git 仓库（从 ${VAULT} 向上查找 .git）` }

      const pull = runGit(root, ['pull', '--ff-only'])
      if (!pull.ok) {
        return {
          kind: 'error',
          text: `git pull 失败：${pull.err || pull.out}\n（本地与远端分叉、或本地有未推送提交时无法快进；可先 /lc-push 推送，或手动 git pull --rebase）`,
        }
      }
      return { kind: 'success', text: pull.out || '已更新到远端最新' }
    },
  })

  // ---- /lc-pick：让 AI 从 Top Interview 150 里挑一道题（结合本地做题进度判断） ----
  ctx.commands.register({
    name: 'lc-pick',
    description: '让 AI 从 Top Interview 150 题单里挑一道题来刷（AI 结合本地做题进度自行判断，不硬编码）',
    input: { hint: '可选：补充你的偏好，如 /lc-pick 想练动态规划' },
    handler(inv) {
      const extra = String(inv.rawInput ?? '').trim()
      const prompt = [
        '请帮我从 LeetCode「面试经典 150 题」（Top Interview 150，https://leetcode.cn/studyplan/top-interview-150/）里挑一道题来刷。',
        '请按下面步骤做：',
        '1. 先调用 leetcode_list_notes 工具，了解我已经做过的题（本地 solutions/ 目录）。',
        '2. 结合我的做题进度，从 Top 150 里挑一道「合适」的题——不要机械地选第一道没做的，可以综合考虑：难度递进、我已刷过的题型、是否连续同类题，以及有没有「复习中 / 未掌握」的题需要重刷（需要的话用 read 工具读对应笔记 frontmatter 的「状态」字段）。',
        '3. 只推荐一道题，给出：题号、中文标题、难度、leetcode.cn 的可点击链接（形如 https://leetcode.cn/problems/<slug>/），再加一句简短理由（为什么现在做这道）。',
        extra ? `补充偏好：${extra}` : '',
        '要求：只输出一道题的推荐，不要列清单。',
      ].filter(Boolean).join('\n')
      inv.agent.steer(createUserMessage({ content: [{ type: 'text', text: prompt }], source: { kind: 'user' } }))
      return { kind: 'success', text: '已让 AI 挑题，正在结合你的进度判断…' }
    },
  })

  // ---- 工具（供 agent 调用） ----
  // 定位：LeetLog 负责"采集代码/统计"，本工具只负责"追加 AI 思路 + 复习状态 + 复杂度"
  ctx.tools.register({
    name: 'leetcode_record_note',
    description: '把 AI 辅助思路、复习状态、复杂度追加进某道题的笔记（LeetLog 生成的那篇，按编号匹配）。笔记不存在则新建兜底。',
    parameters: {
      type: 'object',
      properties: {
        number: { type: 'string', description: '题目编号，如 "1"' },
        title: { type: 'string', description: '题目标题（仅当笔记不存在时用于新建）' },
        insight: { type: 'string', description: 'AI 辅助思路 / 复盘要点' },
        status: { type: 'string', description: '复习状态：已掌握 / 复习中 / 未掌握' },
        time: { type: 'string', description: '时间复杂度，如 O(n)' },
        space: { type: 'string', description: '空间复杂度，如 O(n)' },
      },
      required: ['number'],
    },
    output: { schema: { type: 'string' }, render: textRender },
    async execute(args) {
      const vaultErr = vaultError()
      if (vaultErr) return vaultErr
      const number = String(args?.number ?? '').trim()
      if (!number) return '缺少 number 参数'
      const target = findNoteByNumber(number) ?? createFallbackNote(number, args?.title)
      if (args?.insight) appendAiInsight(target.file, String(args.insight).trim())
      if (args?.status) setFrontmatterField(target.file, '状态', String(args.status).trim())
      if (args?.time) setFrontmatterField(target.file, '复杂度-时间', String(args.time).trim())
      if (args?.space) setFrontmatterField(target.file, '复杂度-空间', String(args.space).trim())
      return `已写入 ${target.rel}`
    },
  })

  ctx.tools.register({
    name: 'leetcode_list_notes',
    description: '列出本地刷题库 solutions/ 目录下已有的题目笔记文件名。',
    parameters: { type: 'object', properties: {} },
    output: { schema: { type: 'string' }, render: textRender },
    async execute() {
      const vaultErr = vaultError()
      if (vaultErr) return vaultErr
      const dir = join(VAULT, 'solutions')
      if (!existsSync(dir)) return '（还没有任何题目笔记）'
      const files = readdirSync(dir).filter((f) => f.endsWith('.md')).sort()
      return files.length ? files.map((f, i) => `${i + 1}. ${f}`).join('\n') : '（空）'
    },
  })
}
