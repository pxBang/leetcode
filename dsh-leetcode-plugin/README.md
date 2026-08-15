# dsh-leetcode-plugin

把 LeetCode 刷题流程（官方题库 + Obsidian 记录 + AI 思路沉淀）串进 DeepSeek Harness 的 Web GUI。

## 安装与激活

```bash
# 1. 安装到正在使用的 web profile
dsh plugin --profile web add /Users/panxingbang/Desktop/deepseek/dsh/dsh-leetcode-plugin

# 2. 重启 harness 才会加载新插件（插件集合变更在重启后生效）
#    先 Ctrl-C 停掉当前 dsh web，再重新启动：
dsh web
```

> 若 `dsh plugin add` 报 pnpm 依赖安装问题，先确认 pnpm 在 PATH，重跑一次即可。
> 修改 `index.js` 后：直接重启 `dsh web` 生效（生产 profile 无 HMR，改代码不热更）。

## 命令（slash，不耗 token）

| 命令 | 作用 |
|---|---|
| `/lc 1` 或 `/lc 两数之和` 或 `/lc <url>` | 建/开题目笔记，输出 LeetCode + Obsidian 两个跳转链接 |
| `/lc-log` | 打开/创建今天的刷题日志 |

## 工具（agent 可调用）

| 工具 | 作用 |
|---|---|
| `leetcode_record_note` | 创建/补充一道题的笔记（难度、标签、代码、AI 思路） |
| `leetcode_list_notes` | 列出已有题目笔记 |

## 配置（环境变量，可覆盖默认值）

| 变量 | 默认值 |
|---|---|
| `DSH_LEETCODE_VAULT` | `/Users/panxingbang/Desktop/deepseek/dsh/leetcode` |
| `DSH_LEETCODE_BASE` | `https://leetcode.cn` |
| `DSH_LEETCODE_VAULT_NAME` | `leetcode`（Obsidian vault 名） |

## 工作流

1. `/lc 1` → 建笔记 + 得到 LeetCode 和 Obsidian 跳转链接
2. 在 LeetCode 刷题（LeetLog 插件自动计时/存码）
3. 刷完让 AI 用「总结卡片话术」复盘，或直接让 agent 调 `leetcode_record_note` 把解法+AI 思路写进笔记
4. `/lc-log` 打开今日日志补一句复盘
