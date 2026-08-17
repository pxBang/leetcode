# dsh-leetcode-plugin

把 LeetCode 刷题流程（官方题库 + Obsidian 记录 + AI 思路沉淀 + git 同步）串进 DeepSeek Harness 的 Web GUI。

## 安装与激活

```bash
# 1. 安装到正在使用的 web profile
dsh plugin --profile web add /Users/panxingbang/Desktop/leetcode/dsh-leetcode-plugin

# 2. 重启才会加载新插件（插件集合变更在重启后生效）：
#    Ctrl-C 停掉当前 dsh web，再重新启动
dsh web
```

> 若 `dsh plugin add` 报 pnpm 依赖问题：先装 pnpm（`curl -fsSL https://get.pnpm.io/install.sh | sh -`），再重跑一次。
> 修改 `index.js` 后：重启 `dsh web` 生效（生产 profile 无 HMR）。

## 命令（slash，不耗 token）

| 命令 | 作用 |
|---|---|
| `/lc-pick [偏好]` | 让 AI 从 Top Interview 150 挑一道题（AI 结合本地进度自行判断，可加偏好如「想练 DP」） |
| `/lc-fupan <编号>` | 触发 AI 复盘某题：读笔记 → 分析解法 → 写回思路/状态/复杂度 |
| `/lc-push [提交信息]` | git add -A + commit + push 到远端（默认提交信息「刷题记录 日期」） |
| `/lc-pull` | 从远端拉取最新（git pull --ff-only，快进合并，不产生 merge commit） |

## 工具（agent 可调用）

| 工具 | 作用 |
|---|---|
| `leetcode_record_note` | 往某题笔记追加 AI 思路/复习状态/复杂度（number/insight/status/time/space） |
| `leetcode_list_notes` | 列出已有题目笔记 |

## 配置（环境变量，可覆盖默认值）

| 变量 | 默认值 |
|---|---|
| `DSH_LEETCODE_VAULT` | `/Users/panxingbang/Desktop/leetcode/leetcode` |
| `DSH_LEETCODE_BASE` | `https://leetcode.cn` |

## 工作流

1. 用 `/lc-pick` 让 AI 挑下一道题（AI 结合进度判断）
2. LeetCode 刷题 → LeetLog 自动计时、AC 后自动写笔记到 vault 的 `solutions/`
3. 回 DSH 用 `/lc-fupan <编号>` 让 AI 复盘，思路/状态/复杂度写进同一篇笔记
4. `/lc-push` 提交推送；在别的机器改动后 `/lc-pull` 拉取最新
