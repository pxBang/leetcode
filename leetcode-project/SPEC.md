# LeetCode 刷题系统 Spec

> 版本：0.8.0 · 2026-08-17
> 目标：官方题库刷题 + 每次刷完有记录（代码 + 我的思路 + AI 辅助思路 + 复盘），记录本地化、可搜索、可版本管理，并能从 DSH Web 页面复盘与 git 同步。

## 1. 目标

1. **刷题**：用 LeetCode 官方题库（官网 / App）。
2. **记录**：每道题一份 Markdown 笔记（LeetLog 自动生成：题面 + 代码 + 用时 + 统计）。
3. **沉淀**：AI 辅助思路 / 复习状态 / 复杂度追加进同一篇笔记，本地可搜索。
4. **同步**：笔记仓库 git push / pull 到远端（私有仓库 `pxBang/leetcode`）。
5. **浏览**：Obsidian 打开 vault 复习，Dataview 看统计。

## 2. 架构

```
┌─────────────┐   刷题   ┌──────────────┐   AC 自动存码   ┌──────────────────┐
│ LeetCode 官网 │ ──────► │ LeetLog 插件  │ ─────────────► │ Obsidian vault   │
└─────────────┘          └──────────────┘                 │  (leetcode/ 目录) │
                                                                   ▲
                                          AI 复盘 + git 同步        │ 读/写
┌──────────────────────────────────────────────────────────────────┴─────────┐
│                        DSH Web (http://127.0.0.1:3080)                       │
│  dsh-leetcode-plugin（Cordis 插件，零依赖）                                    │
│    · 命令：/lc-pick  /lc-fupan  /lc-push  /lc-pull                           │
│    · 工具：leetcode_record_note  leetcode_list_notes  leetcode_commit        │
└───────────────────────────────────────────────────────────────┬─────────────┘
                                                          git push/pull
                                                                 ▼
                                                       ┌────────────────┐
                                                       │ GitHub 私有仓库 │
                                                       └────────────────┘
```

**组件职责：**
- **LeetCode 官网**：唯一刷题入口。
- **LeetLog（Chrome 插件）**：做题页自动计时；AC 后自动把代码+统计写入 vault。
- **Obsidian + vault**：本地 Markdown 记录与检索。
- **dsh-leetcode-plugin**：在 DSH 里提供 AI 复盘 + git 同步。

## 3. 目录结构

```
workspace/
├── leetcode/                     ← 纯 Obsidian vault（只放笔记，推 GitHub）
│   ├── 000-AI总结卡片话术.md       ← 刷完发给 AI 的复盘卡片话术
│   ├── templates/                 ← 题目模板 / 每日日志模板
│   ├── solutions/                 ← 每道题一个文件（LeetLog + 插件都写这里）
│   └── daily/                     ← 每日日志
├── leetcode-project/             ← 项目文档（本目录）
└── dsh-leetcode-plugin/          ← DSH 插件（独立）
```

## 4. 数据格式

### 4.1 题目笔记 frontmatter

笔记由 LeetLog 生成（英文字段），插件只**追加**中文字段：

```yaml
---
# ↓ 以下三个由 leetcode_record_note 追加（插在 frontmatter 顶部）
状态: 已掌握          # 已掌握 / 复习中 / 未掌握
复杂度-时间: O(n)
复杂度-空间: O(n)
# ↓ 以下由 LeetLog 生成
id: 1
title: "Two Sum"
url: https://leetcode.cn/problems/two-sum/description/
difficulty: Easy
tags: [Array, Hash Table]
attempts: 1
first_attempt: 2026-08-15
last_attempt: 2026-08-15
total_submissions: 1
total_ac: 1
total_runs: 4
---
```

正文由 LeetLog 生成：题面 callout、`## 第 N 次`、`### ✅ 通过代码`、`### 💭 思路 & 感悟`、`### 📚 学到了什么`、`### 🔀 多种解法`；插件额外追加 `## AI 辅助思路`。

### 4.2 文件命名

LeetLog 按英文 slug 命名：`solutions/NNNN-slug.md`（如 `0001-two-sum.md`）。插件按 4 位编号前缀查找，优先匹配带 slug 的文件。

### 4.3 每日日志

`daily/YYYY-MM-DD.md`，含 frontmatter `日期` + 段落：今日目标 / 今日完成（表格）/ 今日关键收获 / 卡住的题 / 明日计划。

## 5. DSH 插件设计

### 5.1 设计原则
- **零依赖**：不 import 任何 `@deepseek-ai/*` 包，避免 pnpm 依赖问题与版本对齐风险。
- **配置走 config schema**：`export const Config` 声明手写的 standard-schema（零依赖），Cordis 在加载时校验并合并默认值，替代环境变量。
- **命令 vs 工具分工**：命令（slash）负责「复盘触发 + git 同步」，工具负责「写数据」。
- 工具用纯 ToolDefinition 对象注册（`parameters` 直接是编译好的 JSON Schema）。

### 5.2 命令（slash，不耗 token）
| 命令 | 行为 |
|---|---|
| `/lc-pick [偏好]` | 触发 AI 从 Top 150 挑一道题（AI 结合本地进度自行判断，不硬编码） |
| `/lc-fupan <编号>` | 读笔记 → 投递复盘提示给 agent → 写回思路/状态/复杂度 |
| `/lc-ask <编号> <疑问>` | 读笔记代码 → 投递苏格拉底式助教提示给 agent → 引导而非给答案 |
| `/lc-push [提交信息]` | git add -A + commit + push（提交信息可选，不填则由 AI 根据改动自动生成） |
| `/lc-pull` | git pull --ff-only |

### 5.3 工具（供 agent 调用）
| 工具 | 行为 |
|---|---|
| `leetcode_record_note` | 追加 insight / 状态 / 复杂度-时间 / 复杂度-空间 |
| `leetcode_list_notes` | 列出 solutions/ 下文件名 |
| `leetcode_commit` | 用 AI 生成的提交信息完成 commit + push |

### 5.4 配置（插件 config schema）
| 字段 | 默认值 | 说明 |
|---|---|---|
| `leetcodeBase` | `https://leetcode.cn` | LeetCode 站点 |

`vault` 无需配置：插件从自身位置自动推导（同仓库的 `leetcode/` 目录），目录不存在时命令/工具直接报错。`leetcodeBase` 通过 `export const Config`（手写 standard-schema，零依赖）声明，Cordis 加载时校验并合并默认值；配置写在 `dsh-leetcode-plugin/cordis.patch.yml` 的 `id: leetcode` 条目 `config` 里（整段替换，漏写字段回落默认值）。

## 6. 工作流

### 6.1 每日刷题
1. `/lc-pick` 让 AI 挑下一道题（AI 结合进度判断）。
2. LeetCode 刷题（LeetLog 自动计时）。
3. AC → LeetLog 自动写笔记。
4. `/lc-fupan <编号>` 让 AI 复盘，思路/状态/复杂度落盘（或用「AI 总结卡片话术」）。
5. `/lc-push` 提交推送；换机器后 `/lc-pull` 拉最新。

### 6.2 复习节奏
- D+1：不看任何东西重写一遍。
- D+7：加入复习清单再刷一遍。
- 状态机：未掌握 → 复习中 → 已掌握。

## 7. 设计决策

| 决策 | 理由 |
|---|---|
| 零依赖插件 | 规避 pnpm 依赖问题 + 版本对齐，最稳 |
| 配置走插件 `Config`（手写 standard-schema） | 替代环境变量：默认值 + 校验，仍零依赖 |
| 命令做触发/同步、工具做写入 | 写入要 agent 参与；同步是确定性操作 |
| vault 用纯 Markdown | Obsidian 原生、Git 友好、可搜索、可迁移 |
| 编号补零 4 位 | 排序稳定 |
| 题目笔记与日志分目录 | 结构清晰，Dataview 按目录查询 |
| 插件与 vault 分开放 | vault 干净可推 GitHub；插件独立演进 |
| pull 用 --ff-only | 不产生 merge commit，分叉时明确报错而非静默合并 |

## 8. 已知限制

- `obsidian://` 深链在 DSH 聊天里点不开（渲染器只放行 http/https）。
- LeetLog 依赖新版 LeetCode 页面结构，兼容性以实际为准。
