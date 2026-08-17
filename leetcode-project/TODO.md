# 状态与待办

> 插件版本 0.7.1。命令：`/lc-pick` `/lc-fupan` `/lc-push` `/lc-pull`；工具：`leetcode_record_note` / `leetcode_list_notes`。

## ✅ 已完成

- [x] vault 骨架 + 目录解耦（vault / 文档 / 插件分开放）
- [x] LeetLog 集成：计时 + AC 自动存码到 `solutions/`
- [x] 插件 v0.7.0（零依赖）：`/lc-pick` 选题 + `/lc-fupan` 复盘 + `/lc-push` `/lc-pull` git 同步
- [x] git 远端 `pxBang/leetcode` 已配置，首次提交完成
- [x] 配置迁移到插件 config schema（手写 standard-schema `Config`），替代环境变量

## 🟡 待办（可选）

- [ ] `/lc-review`：列出「复习中」的题（读 frontmatter `状态`）
- [ ] 打通「AI 总结卡片」自动化：刷完自动跑卡片话术 → 落盘

## ⏸ 已搁置

- [ ] client 模块常驻按钮（打开 LeetCode / Obsidian）
- [ ] schedule 复习提醒（7 天后会话内提醒）
