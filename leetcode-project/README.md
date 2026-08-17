# LeetCode 刷题系统

本地刷题记录系统：**官方题库刷题 + 代码自动归档 + AI 思路沉淀 + git 同步**，配合 DSH Web 页面（http://127.0.0.1:3080）使用。

> 文档：本 README（使用说明） · [SPEC.md](SPEC.md)（设计规格） · [TODO.md](TODO.md)（状态与待办）

## 目录结构

```
workspace/
├── leetcode/                    ← Obsidian vault（只放笔记，推 GitHub）
│   ├── 000-AI总结卡片话术.md      ← 刷完发给 AI 的复盘卡片话术
│   ├── templates/                ← 题目模板 / 每日日志模板
│   ├── solutions/                ← 每道题一个文件（LeetLog + 插件都写这里）
│   └── daily/                    ← 每日日志
├── leetcode-project/             ← 项目文档（本目录）
└── dsh-leetcode-plugin/          ← DSH 插件（独立）
```

**原则**：`leetcode/` 是纯笔记仓库（推 GitHub），系统文档和插件都放外面，互不耦合。

## 五个组件

| 组件 | 职责 |
|---|---|
| LeetCode 官网 / App | 唯一刷题入口 |
| LeetLog（Chrome 插件） | 做题自动计时；AC 后自动把代码+统计写进 vault |
| Obsidian + `leetcode/` | 本地 Markdown 记录与检索 |
| dsh-leetcode-plugin | 在 DSH 里提供 AI 复盘 + git 同步 |
| GitHub 私有仓库 | 备份与多端同步（`pxBang/leetcode`） |

## 三步开始

### 1. 装 LeetLog
Chrome 装 [LeetLog](https://chromewebstore.google.com/detail/leetlog-%E2%80%94-leetcode-practi/nfdgchmjkdfhcmaglfhngmddhjdogdii)。做题页自动计时，AC 后自动存码。说明见 [YzYhhhstudy/leetlog](https://github.com/YzYhhhstudy/leetlog)。

### 2. Obsidian 打开 vault
下载 [Obsidian](https://obsidian.md) → 「打开文件夹作为 Vault」→ 选 `leetcode/` 文件夹。可选装 Dataview / Templater。

### 3. 装 DSH 插件
```bash
dsh plugin --profile web add ./dsh-leetcode-plugin
# 重启加载（插件集合变更在重启后生效）
dsh web
```

## DSH 插件

### 命令（slash，不耗 token）
| 命令 | 作用 |
|---|---|
| `/lc-pick [偏好]` | 让 AI 从 Top Interview 150 挑一道题（AI 结合进度自行判断） |
| `/lc-fupan <编号>` | 触发 AI 复盘某题，思路/状态/复杂度写回笔记 |
| `/lc-push [提交信息]` | git add -A + commit + push 到远端 |
| `/lc-pull` | 从远端拉取最新（--ff-only 快进） |

### 工具（供 agent 调用）
| 工具 | 作用 |
|---|---|
| `leetcode_record_note` | 追加 AI 思路/状态/复杂度：number/insight/status/time/space |
| `leetcode_list_notes` | 列出已有笔记 |

### 配置（插件 config schema）
| 字段 | 默认值 | 说明 |
|---|---|---|
| `leetcodeBase` | `https://leetcode.cn` | LeetCode 站点 |

`vault` 无需配置：插件自动识别为同仓库的 `leetcode/` 目录，找不到会直接报错。`leetcodeBase` 写在 `dsh-leetcode-plugin/cordis.patch.yml` 的 `id: leetcode` 条目 `config` 里，改完重启 `dsh web` 生效。

## 日常刷题工作流

```
① 用 /lc-pick 让 AI 挑下一道题（AI 结合进度判断）
② 在 LeetCode 刷题（LeetLog 自动计时）
③ AC → LeetLog 自动生成 solutions/NNNN-slug.md（题面+代码+用时+统计）
④ 回 DSH 用 /lc-fupan NNNN 让 AI 复盘 → 思路/状态/复杂度写进同一篇笔记
⑤ （可选）把 000-AI总结卡片话术.md 整段发给任意 AI，得到卡片贴进笔记
⑥ /lc-push 提交推送；换了机器改动后 /lc-pull 拉最新
⑦ Alt-Tab 切 Obsidian 复习，Dataview 看统计
```

**核心原则：AI 只给思路，不给答案；刷完必须留卡，不留卡等于白刷。**

## AI 总结卡片

话术全文在 `leetcode/000-AI总结卡片话术.md`。刷完把它整段发给 AI，AI 按固定格式输出卡片（解法、卡点、核心 trick、最优解对比、复习提醒），粘贴进笔记即可。通用版，ChatGPT / Claude / Gemini 均可用。

## 统计看板（Dataview 可选）

在 vault 里新建笔记，粘贴：

```dataview
TABLE first_attempt AS 首次, difficulty AS 难度, 状态, 复杂度-时间 AS 时间, 复杂度-空间 AS 空间
FROM "solutions"
SORT first_attempt DESC
```

> 注意：`obsidian://` 链接在 DSH 聊天里点不开（渲染器只放行 http/https）；跳 LeetCode 用聊天里的 https 链接，开 Obsidian 用 Alt-Tab 或复制 URL。
