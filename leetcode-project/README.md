# LeetCode 刷题系统

本地刷题记录系统：**官方题库刷题 + 代码自动归档 + AI 思路沉淀**，配合 DSH Web 页面（http://127.0.0.1:3080）使用。

> 文档：本 README（使用说明） · [SPEC.md](SPEC.md)（设计规格） · [TODO.md](TODO.md)（状态与待办）

---

## 目录结构（已解耦）

```
workspace/
├── leetcode/                     ← Obsidian vault（只放笔记，推 GitHub）
│   ├── 000-AI总结卡片话术.md       ← 刷完发给 AI 的复盘卡片话术
│   ├── templates/                 ← 题目模板 / 每日日志模板
│   ├── solutions/                 ← 每道题一个文件（LeetLog + 插件都写这里）
│   └── daily/                     ← 每日日志
├── leetcode-project/              ← 项目文档（本目录，不混进 vault）
└── dsh-leetcode-plugin/           ← DSH 插件（独立）
```

**原则**：`leetcode/` 是纯笔记仓库（推 GitHub），系统文档和插件都放外面，互不耦合。

---

## 五个组件

| 组件 | 职责 |
|---|---|
| LeetCode 官网 / App | 唯一刷题入口 |
| LeetLog（Chrome 插件） | 打开做题页自动计时；AC 后自动把代码+统计写进 vault |
| Obsidian + `leetcode/` | 本地 Markdown 记录与检索 |
| dsh-leetcode-plugin | 在 DSH 里提供记录工具（AI 写思路）+ 明文 URL；跳转走聊天链接 |
| GitHub 私有仓库（P3） | 备份与维护 |

---

## 三步开始

### 1. 装 LeetLog
Chrome 装 [LeetLog](https://chromewebstore.google.com/detail/leetlog-%E2%80%94-leetcode-practi/nfdgchmjkdfhcmaglfhngmddhjdogdii)。做题页自动计时，AC 后自动存码。说明见 [YzYhhhstudy/leetlog](https://github.com/YzYhhhstudy/leetlog)。

### 2. Obsidian 打开 vault
下载 [Obsidian](https://obsidian.md) → 「打开文件夹作为 Vault」→ 选 `leetcode/` 文件夹。可选装 **Dataview** / **Templater** 插件。

### 3. 装 DSH 插件
```bash
npx @deepseek-ai/dsh plugin --profile web add /Users/panxingbang/Desktop/deepseek/dsh/dsh-leetcode-plugin
# 重启加载（插件集合变更在重启后生效）
npx @deepseek-ai/dsh web
```

---

## DSH 插件

### 命令（slash，不耗 token）
| 命令 | 作用 |
|---|---|
| `/lc <编号\|标题\|url>` | 建/开题目笔记 + 输出明文 URL（纯文本，不可点，供复制） |
| `/lc-log` | 打开/创建今日日志 |

### 工具（供 agent 调用）
| 工具 | 作用 |
|---|---|
| `leetcode_record_note` | 追加 AI 思路/状态/复杂度：number/title/insight/status/time/space |
| `leetcode_list_notes` | 列出已有笔记 |

### 配置（环境变量）
| 变量 | 默认值 |
|---|---|
| `DSH_LEETCODE_VAULT` | `/Users/panxingbang/Desktop/deepseek/dsh/leetcode` |
| `DSH_LEETCODE_BASE` | `https://leetcode.cn` |
| `DSH_LEETCODE_VAULT_NAME` | `leetcode` |

---

## 日常刷题工作流（5 步）

```
① 对 AI 说"给我第 1 题的链接"（或敲 /lc 1）→ 拿到 LeetCode 链接
② 点聊天里的 https 链接 → 去 LeetCode 刷题（LeetLog 自动计时）
③ AC → LeetLog 自动生成 0001-two-sum.md（题面+代码+用时+统计）
④ 回 DSH 对 AI 说"帮我复盘这道题" → AI 讲思路
⑤ AI 调 leetcode_record_note → 把思路/状态/复杂度写进同一篇笔记
⑥ Alt-Tab 切到 Obsidian 复习，Dataview 看统计
```

**核心原则：AI 只给思路，不给答案；刷完必须留卡，不留卡等于白刷。**

---

## AI 总结卡片

话术全文在 `leetcode/000-AI总结卡片话术.md`。刷完把它整段发给 AI，AI 按固定格式输出卡片（解法、卡点、核心 trick、最优解对比、复习提醒），粘贴进笔记即可。通用版，ChatGPT / Claude / Gemini 均可用。

---

## 统计看板（Dataview 可选）

在 vault 里新建笔记，粘贴：

```dataview
TABLE dateformat(日期, "yyyy-MM-dd") AS 日期, 难度, 状态, 复杂度-时间 AS 时间, 复杂度-空间 AS 空间
FROM "solutions"
SORT 日期 DESC
```

---

## 已验证的集成结论

- ✅ LeetLog 刷题计时 + AC 自动存码，输出到 `solutions/`
- ✅ Obsidian 打开 `leetcode/` 成 vault（vault 名 = `leetcode`）
- ✅ 插件追加模式：`leetcode_record_note` 写进 LeetLog 生成的笔记
- ⚠️ slash 命令结果是纯文本（不渲染链接）；`obsidian://` 被 markdown 渲染器剥离 → **跳转用聊天里的 https 链接，Obsidian 用 Alt-Tab 或复制 URL**

---

## 备份（P3，暂缓）

```bash
cd leetcode
git init
git add .
git commit -m "init leetcode notes"
git remote add origin https://github.com/<你>/leetcode-notes.git   # 建私有仓库后
git push -u origin main
```
