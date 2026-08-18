---
复杂度-空间: O(1)
复杂度-时间: O(n)
状态: 已掌握
id: 80
title: "Remove Duplicates from Sorted Array II"
url: https://leetcode.cn/problems/remove-duplicates-from-sorted-array-ii/description/
difficulty: Medium
tags: [Array, Two Pointers]
attempts: 2
first_attempt: 2026-08-17
last_attempt: 2026-08-18
total_submissions: 2
total_ac: 2
total_runs: 7
---

# 80. Remove Duplicates from Sorted Array II

> Medium · Array / Two Pointers · [题目链接](https://leetcode.cn/problems/remove-duplicates-from-sorted-array-ii/description/)


> [!abstract]- 题面
> 给你一个有序数组 `nums` ，请你**原地** 删除重复出现的元素，使得出现次数超过两次的元素**只出现两次** ，返回删除后数组的新长度。
>
> 不要使用额外的数组空间，你必须在 **原地 修改输入数组**并在使用 O(1) 额外空间的条件下完成。
>
> **说明：**
>
> 为什么返回数值是整数，但输出的答案是数组呢？
>
> 请注意，输入数组是以**「引用」**方式传递的，这意味着在函数里修改输入数组对于调用者是可见的。
>
> 你可以想象内部操作如下:
>
> ```
> // nums 是以“引用”方式传递的。也就是说，不对实参做任何拷贝
> int len = removeDuplicates(nums);
>
> // 在函数里修改输入数组对于调用者是可见的。
> // 根据你的函数返回的长度, 它会打印出数组中 该长度范围内 的所有元素。
> for (int i = 0; i < len; i++) {
>     print(nums[i]);
> }
> ```
>
> **示例 1：**
>
> ```
> 输入：nums = [1,1,1,2,2,3]
> 输出：5, nums = [1,1,2,2,3]
> 解释：函数应返回新长度 length = 5, 并且原数组的前五个元素被修改为 1, 1, 2, 2, 3。 不需要考虑数组中超出新长度后面的元素。
> ```
>
> **示例 2：**
>
> ```
> 输入：nums = [0,0,1,1,1,1,2,3,3]
> 输出：7, nums = [0,0,1,1,2,3,3]
> 解释：函数应返回新长度 length = 7, 并且原数组的前七个元素被修改为 0, 0, 1, 1, 2, 3, 3。不需要考虑数组中超出新长度后面的元素。
> ```
>
> **提示：**
>
> - `1 <= nums.length <= 3 * 104`
> - `-104 <= nums[i] <= 104`
> - `nums` 已按升序排列

讲解视频: [YouTube](https://www.youtube.com/results?search_query=leetcode%2080.%20Remove%20Duplicates%20from%20Sorted%20Array%20II) · [Bilibili](https://search.bilibili.com/all?keyword=leetcode%2080.%20Remove%20Duplicates%20from%20Sorted%20Array%20II)

## 第 1 次 · 2026-08-17 周一
⏱ 开始 15:11 → 首提 15:36 · 编码 24 分钟 → AC 15:36 · 提交 1 次 / 通过 1 次 · 运行 5 次

### ✅ 通过代码 · C++ · 15:36（8 ms · 19.3 MB）
> [!success]- 代码
> ```cpp
> class Solution {
> public:
>     int removeDuplicates(vector<int>& nums) {
>         int slow = 0;
>         int fast = 1;
>         int common_len = 1;
>         while (fast < nums.size()) {
>             if (common_len < 2) {
>                 if (nums[fast] == nums[slow]) {
>                     common_len++;
>                     slow++;
>                     nums[slow] = nums[fast];
>                     fast++;
>                 } else {
>                     slow++;
>                     nums[slow] = nums[fast];
>                     fast++;
>                     common_len = 1;
>                 }
>             } else {
>                 if (nums[fast] == nums[slow]) {
>                     common_len++;
>                     fast++;
>                 } else {
>                     slow++;
>                     nums[slow] = nums[fast];
>                     fast++;
>                     common_len = 1;
>                 }
>             }
>         }
>
>         return slow + 1;
>     }
> };
> ```

### 💭 思路 & 感悟
-

### 📚 学到了什么（新函数 / 新数据结构 / 新套路）
-

### 🔀 多种解法
-

## AI 辅助思路

- [2026-08-18] 已写出标准最优模板（第二次 AC）：int slow=0; for(int fast=0; fast<n; fast++) if(slow<2 || nums[slow-2]!=nums[fast]) nums[slow++]=nums[fast]; return slow; O(n)/O(1)。关键点全部到位：① slow 用「下一个写入位置 = 最终长度」习惯，故 return slow（非 slow+1）；② slow<2 靠 || 短路兜住前两个元素、防 nums[slow-2] 越界；③ 与「倒数第 2 个已保留元素」比较等价于「这值是否已出现 2 次」，依赖数组有序。相比首次的 common_len 状态机，本质是把「计数保留几个」换成更本质的「和倒数第 2 个比」。k=1 即 #26，任意 k 都是 if(i<k || nums[j]!=nums[i-k])。

- [2026-08-17] 解法正确且最优：快慢指针 + common_len 计数，一次遍历 O(n)、原地 O(1)。你的写法把「当前值已保留几个」做成显式状态机，逻辑对但偏冗长、分支重复。更干净的「保留 k 个」通用模板：int i=0; for(int j=0;j<n;j++) if(i<2 || nums[j]!=nums[i-2]) nums[i++]=nums[j]; return i; —— 前 2 个永远保留，之后的元素只有当它 ≠ 倒数第 2 个已保留元素时才写入。k=1 时即退化成 #26 的 if(i<1 || nums[j]!=nums[i-1])，两题本质同一套路，记这个模板可一眼推广到任意 k。


## 第 2 次 · 2026-08-18 周二
⏱ 开始 10:20 → 首提 10:41 · 编码 21 分钟 → AC 10:41 · 提交 1 次 / 通过 1 次 · 运行 2 次 · 本题停留 32 分钟

### ✅ 通过代码 · C++ · 10:41（6 ms · 19 MB）
> [!success]- 代码
> ```cpp
> class Solution {
> public:
>     int removeDuplicates(vector<int>& nums) {
>         int slow = 0; // 下一个要写入的位置
>         for (int fast = 0; fast < nums.size(); fast++) {
>             if (slow < 2 || nums[slow - 2] != nums[fast]) {
>                 nums[slow] = nums[fast];
>                 slow++;
>             }
>         }
>         return slow;
>     }
> };
> ```

### 💭 思路 & 感悟
-

### 📚 学到了什么（新函数 / 新数据结构 / 新套路）
- **保留2个相同元素 等价于 和已保留元素的倒数第二个来比**
- slow 指向下一个要写入的位置
- nums[fast] 指向下一个要判断的值
- 跳过 等价于 fast++
- 保留 等价于 nums[slow] = nums[fast], slow++, fast++

### 🔀 多种解法
-
