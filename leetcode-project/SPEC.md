# LeetCode 刷题系统 Spec

> 版本：0.2 · 2026-08-15
> 目标：官方题库刷题 + 每次刷完有记录（代码 + 我的思路 + AI 辅助思路 + 复盘），记录本地化、可搜索、可版本管理，并能从 DSH Web 页面方便跳转。

---

## 1. 目标（Goals）

1. **刷题**：用 LeetCode 官方题库（官网 / App）。
2. **记录**：每道题留一份 Markdown 笔记，包含代码、思路、AI 辅助思路、复盘。
3. **沉淀**：数据全部在本地，可全文搜索、可打标签、可迁移。
4. **跳转**：从 DSH Web 页面（http://127.0.0.1:3080）一键跳到 LeetCode 题目 / Obsidian 笔记。
5. **维护**：整个 vault 推送到 GitHub 私有仓库做备份与长期维护。

---

## 2. 架构总览（Architecture）

```
┌─────────────┐   刷题   ┌──────────────┐   AC 自动存码   ┌──────────────────┐
│ LeetCode 官网 │ ──────► │ LeetLog 插件  │ ─────────────► │ Obsidian vault   │
└─────────────┘          └──────────────┘                 │  (leetcode/ 目录) │
       ▲                                                   └────────┬─────────┘
       │ 跳转链接                                             ▲ 写笔记 │ 读/列
       │                                                      │        │
┌──────┴──────────────────────────────────────────────────────┴────────▼─────────┐
│                        DSH Web (http://127.0.0.1:3080)                          │
│  dsh-leetcode-plugin（Cordis 插件，零依赖）                                       │
│    · 命令：/lc  /lc-log              （slash，不耗 token，渲染跳转链接）          │
│    · 工具：leetcode_record_note  leetcode_list_notes（供 agent 写/读笔记）       │
└───────────────────────────────────────────────────────────────────────────────────┘
                          │ git push
                          ▼
                 ┌────────────────┐
                 │  GitHub 私有仓库 │
                 └────────────────┘
```

**四个组件各自职责：**
- **LeetCode 官网**：唯一刷题入口。
- **LeetLog（Chrome 插件）**：打开做题页自动计时；提交通过后自动把代码和统计写入本地 Obsidian 笔记。
- **Obsidian + vault**：本地 Markdown 记录与检索。
- **dsh-leetcode-plugin**：在 DSH 里提供跳转命令 + 记录工具，把"刷题 → 记录 → 复盘"串成一条链。

---

## 3. 目录结构（Layout）

> 原则：**vault 与项目文档解耦**。`leetcode/` 只放笔记内容（推 GitHub），系统文档放 `leetcode-project/`，插件独立。

```
workspace/
├── leetcode/                     ← 纯 Obsidian vault（只放笔记，推 GitHub）
│   ├── 000-AI总结卡片话术.md       ← 刷完发给 AI 的复盘卡片话术（核心复用件）
│   ├── templates/
│   │   ├── 题目模板.md
│   │   └── 每日日志模板.md
│   ├── solutions/                ← 每道题一个文件（LeetLog + 插件都写这里）
│   │   └── 0001.md / 0001-两数之和.md
│   └── daily/                    ← 每日日志
├── leetcode-project/             ← 项目文档（不混进 vault，不推或单独推）
│   ├── README.md                 ← 系统使用说明
│   ├── SPEC.md                   ← 本文件
│   └── TODO.md                   ← 状态与待办
└── dsh-leetcode-plugin/          ← DSH 插件（建议单独一个 git 仓库）
    ├── package.json              ← 声明 dsh.bundle
    ├── cordis.patch.yml          ← 插件层
    ├── index.js                  ← 命令 + 工具实现
    └── README.md
```

---

## 4. 数据格式（Data formats）

### 4.1 题目笔记 frontmatter

```yaml
---
编号: 1
标题: 两数之和
难度: Easy
标签: [数组, 哈希表]
状态: 已掌握          # 已掌握 / 复习中 / 未掌握
日期: 2026-08-15
复杂度-时间: O(n)
复杂度-空间: O(n)
来源: https://leetcode.cn/problems/two-sum/
---
```

正文固定段落：`## 题目` / `## 我的解法` / `## 我的思路` / `## AI 辅助思路` / `## 最优解对比` / `## 官方题解要点` / `## 复盘 & 下次复习提醒`。

### 4.2 文件命名约定（待收敛）

| 输入 | 生成文件 |
|---|---|
| `/lc 1`（无标题） | `solutions/0001.md` |
| `/lc 1 两数之和`（带标题） | `solutions/0001-两数之和.md` |

> ⚠️ 已知问题：同一题先用无标题、后补标题会产生两个文件。收敛方案见 TODO P0-2。

### 4.3 每日日志

`daily/YYYY-MM-DD.md`，含 frontmatter `日期` + 段落：今日目标 / 今日完成（表格）/ 今日关键收获 / 卡住的题 / 明日计划。

---

## 5. DSH 插件设计（dsh-leetcode-plugin）

### 5.1 设计原则
- **零依赖**：不 import 任何 `@deepseek-ai/*` 包，避免 pnpm `link:` 软链接不装依赖的问题，也消除版本对齐风险。
- **命令 vs 工具分工**：命令（slash）负责"跳转"，工具负责"写数据"。
- 工具用**纯 ToolDefinition 对象**注册（`parameters` 直接是编译好的 JSON Schema）。

### 5.2 命令（slash，不耗 token，结果渲染为 UI 文本）
| 命令 | 状态 | 行为 |
|---|---|---|
| `/lc <编号\|标题\|url>` | ✅ 已实现 | 建题目笔记 + 输出 LeetCode / Obsidian 跳转链接 |
| `/lc-log` | ✅ 已实现 | 打开/创建今日日志 |
| `/lc-review` | ⏳ 规划 | 列出"复习中"的题 |
| `/lc-push` | ⏳ 规划 | git add/commit/push（P3） |

### 5.3 工具（供 agent 调用）
| 工具 | 状态 | 行为 |
|---|---|---|
| `leetcode_record_note` | 🟡 部分 | 建/补笔记：number/title/difficulty/tags/insight（code 参数已收但未落盘） |
| `leetcode_list_notes` | ✅ 已实现 | 列出 solutions/ 下文件名 |
| 补：`leetcode_set_status` | ⏳ 规划 | 更新"状态/复杂度"字段 |

### 5.4 配置（环境变量）
| 变量 | 默认值 |
|---|---|
| `DSH_LEETCODE_VAULT` | `/Users/panxingbang/Desktop/deepseek/dsh/leetcode` |
| `DSH_LEETCODE_BASE` | `https://leetcode.cn` |
| `DSH_LEETCODE_VAULT_NAME` | `leetcode` |

> 规划：迁移到插件 config schema（`ctx.config`），让用户在 cordis patch 里配置，而非环境变量。

### 5.5 后续形态
- **Phase 2**：client 模块常驻按钮（打开 LeetCode / Obsidian / 今日日志），用 `dsh.client` + `exports["./client"]` 注入浏览器 bundle。
- **Phase 3**：schedule 子系统做复习提醒（`after` / `at` / `every`）。

---

## 6. 工作流（Workflow）

### 6.1 每日刷题（5 步）
1. `/lc 1 两数之和` → 建笔记 + 拿到跳转链接。
2. 点 LeetCode 链接刷题（LeetLog 自动计时）。
3. 提交通过 → LeetLog 自动把代码+统计写入 vault（或手动让 agent 调工具补）。
4. 刷完把「000-AI总结卡片话术」发给 AI，得到总结卡片。
5. 粘贴卡片 / 让 agent 调 `leetcode_record_note` 落盘 → `/lc-log` 补一句复盘。

### 6.2 复习节奏
- D+1：不看任何东西重写一遍。
- D+7：加入复习清单再刷一遍。
- 状态机：未掌握 → 复习中 → 已掌握。

---

## 7. 设计决策（Decisions & 理由）

| 决策 | 理由 |
|---|---|
| 零依赖插件 | 规避 pnpm `link:` 不装依赖 + 版本对齐，最稳 |
| 命令做跳转、工具做写入 | 跳转要 UI 渲染、不耗 token；写入要 agent 参与 |
| vault 用纯 Markdown | Obsidian 原生、Git 友好、可搜索、可迁移 |
| 编号补零 4 位 | 排序稳定 |
| 题目笔记与日志分目录 | 结构清晰，Dataview 按目录查询 |
| 插件与 vault 分开放 | vault 干净可推 GitHub；插件独立演进 |

---

## 8. 已知风险（见 TODO.md 第 5 节）

- `obsidian://` 深链可点性未验证
- LeetLog 与新版 LeetCode 的兼容性、以及它写笔记的目录/格式与 `solutions/` 对齐问题
- `today()` 用 UTC 日期，UTC+8 凌晨会差一天
- slash 命令在 Web 适配器的实际 UI 呈现未完整确认
