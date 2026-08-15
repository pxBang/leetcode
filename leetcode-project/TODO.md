# 状态与待办（Roadmap）

> 配套 [SPEC.md](SPEC.md)。勾选进度：`[x]` 已完成，`[ ]` 未做。

---

## ✅ 已完成（Done）

- [x] 本地 vault 骨架：`leetcode/` 目录 + 模板 + AI 卡片话术
- [x] 目录解耦：vault（`leetcode/`）与项目文档（`leetcode-project/`）分离，vault 只放笔记
- [x] 命名/格式对齐：以 LeetLog 英文 slug 为准（`0001-two-sum.md`），插件改为「追加」不再另建文件
- [x] 清理重复：solutions/ 只保留 LeetLog 生成的 `0001-two-sum.md`
- [x] DSH 插件 v0.4.0（零依赖，追加模式）：`dsh-leetcode-plugin/`
- [x] 插件安装进 web profile（`dsh plugin --profile web add`）
- [x] `/lc`、`/lc-log` 命令
- [x] `leetcode_record_note`、`leetcode_list_notes` 工具
- [x] 真机冒烟测试：追加模式三场景通过

---

## 🔴 P0 —— 本轮已修

- [x] **P0-1** `code` 参数落盘到「我的解法」代码块
- [x] **P0-2** 命名收敛：带标题时若已存在纯编号文件，重命名复用，不新建第二个文件
- [x] **P0-3** 日期改用本地时区（弃用 UTC 的 `toISOString`）
- [x] **P0-4** 清理占位示例（`示例-两数之和.md`、`daily/2026-04-19.md` 已删；模板在 `templates/`）

---

## 🟡 P1 —— 集成验证（结论已出）

- [x] **P1-1** LeetLog 装好，刷题计时 + AC 自动存码 ✅
- [x] **P1-2** LeetLog 输出目录/文件名与 `solutions/` 对齐 ✅
- [x] **P1-3** Obsidian 打开 `leetcode/` 成 vault ✅
- [x] **P1-4** `obsidian://` 链接：聊天里**点不开**（markdown 渲染器只放行 http/https，剥掉自定义协议）→ 用 Alt-Tab 或复制 URL 到浏览器地址栏回车
- [x] **P1-5** slash 命令结果：**纯文本，不渲染链接**（DSH 硬限制）→ 跳转改用「聊天里让 AI 给 https 链接」
- [x] **P1-6** v0.4.0 追加模式验证通过

> **结论**：LeetCode 跳转 = 聊天里让 AI 给 https 链接（可点）；Obsidian = Alt-Tab / 复制 obsidian:// 到地址栏。真一键按钮需 Phase 2（客户端模块），暂缓。

---

## 🟢 P2 —— 功能增强（⏸ pending）

- [ ] **P2-1** `/lc-review` 命令：列出"复习中"的题（读 frontmatter 状态）
- [ ] **P2-2** `leetcode_set_status` 工具：更新状态 / 复杂度字段（闭环"复习节奏"）
- [ ] **P2-3** 打通"AI 总结卡片"自动化：刷完后 agent 自动跑卡片话术 → 落盘
- [ ] **P2-4** 配置迁移到插件 config schema（`ctx.config`），替代环境变量
- [ ] **P2-5**（Phase 2）client 模块常驻按钮：打开 LeetCode / Obsidian / 今日日志
- [ ] **P2-6**（Phase 3）schedule 复习提醒：7 天后会话内提醒

---

## 🔵 P3 —— 维护与备份（⏸ pending）

- [ ] **P3-1** `leetcode/` 初始化 git + `.gitignore`（排除 `.obsidian/workspace*` 等本地态）
- [ ] **P3-2** 首次 commit
- [ ] **P3-3** 建 GitHub **私有**仓库，配 remote，首次 push
- [ ] **P3-4** 决定插件是否单独一个仓库（建议单独）
- [ ] **P3-5**（可选）`/lc-push` 命令：一键 git add/commit/push

---

## ⚠️ 风险与待确认

- [⏸ 暂缓] LeetHub/LeetLog 与新版 LeetCode 的兼容性（用户决定先不管）
- [⏸ 暂缓] npx 缓存稳定性（用户决定先不管）
- [⏸ 暂缓] AI 助手选型（用户决定先不管）
- [✅ 已解决] Obsidian vault 纯净度 → 目录已解耦（vault 只放笔记）
