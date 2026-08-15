---
复杂度-空间: O(1)
复杂度-时间: O(n)
状态: 已掌握
id: 26
title: "Remove Duplicates from Sorted Array"
url: https://leetcode.cn/problems/remove-duplicates-from-sorted-array/description/
difficulty: Easy
tags: [Array, Two Pointers]
attempts: 1
first_attempt: 2026-08-15
last_attempt: 2026-08-15
total_submissions: 1
total_ac: 1
total_runs: 12
---

# 26. Remove Duplicates from Sorted Array

> Easy · Array / Two Pointers · [题目链接](https://leetcode.cn/problems/remove-duplicates-from-sorted-array/description/)


> [!abstract]- 题面
> 给你一个 **非严格递增排列** 的数组 `nums` ，请你**原地** 删除重复出现的元素，使每个元素 **只出现一次** ，返回删除后数组的新长度。元素的 **相对顺序** 应该保持 **一致** 。然后返回 `nums` 中唯一元素的个数。
>
> 考虑 `nums` 的唯一元素的数量为 `k`。去重后，返回唯一元素的数量 `k`。
>
> `nums` 的前 `k` 个元素应包含 **排序后** 的唯一数字。下标 `k - 1` 之后的剩余元素可以忽略。
>
> **判题标准:**
>
> 系统会用下面的代码来测试你的题解:
>
> ```
> int[] nums = [...]; // 输入数组
> int[] expectedNums = [...]; // 长度正确的期望答案
>
> int k = removeDuplicates(nums); // 调用
>
> assert k == expectedNums.length;
> for (int i = 0; i < k; i++) {
>     assert nums[i] == expectedNums[i];
> }
> ```
>
> 如果所有断言都通过，那么您的题解将被 **通过**。
>
> **示例 1：**
>
> ```
> 输入：nums = [1,1,2]
> 输出：2, nums = [1,2,_]
> 解释：函数应该返回新的长度 2 ，并且原数组 nums 的前两个元素被修改为 1, 2 。不需要考虑数组中超出新长度后面的元素。
> ```
>
> **示例 2：**
>
> ```
> 输入：nums = [0,0,1,1,1,2,2,3,3,4]
> 输出：5, nums = [0,1,2,3,4,_,_,_,_,_]
> 解释：函数应该返回新的长度 5 ， 并且原数组 nums 的前五个元素被修改为 0, 1, 2, 3, 4 。不需要考虑数组中超出新长度后面的元素。
> ```
>
> **提示：**
>
> - `1 <= nums.length <= 3 * 104`
> - `-100 <= nums[i] <= 100`
> - `nums` 已按 **非递减** 顺序排列。

讲解视频: [YouTube](https://www.youtube.com/results?search_query=leetcode%2026.%20Remove%20Duplicates%20from%20Sorted%20Array) · [Bilibili](https://search.bilibili.com/all?keyword=leetcode%2026.%20Remove%20Duplicates%20from%20Sorted%20Array)

## 第 1 次 · 2026-08-15 周六
⏱ 开始 20:49 → 首提 21:21 · 编码 33 分钟 → AC 21:21 · 提交 1 次 / 通过 1 次 · 运行 12 次

### ✅ 通过代码 · C++ · 21:21（0 ms · 22.1 MB）
> [!success]- 代码
> ```cpp
> class Solution {
> public:
>     int removeDuplicates(vector<int>& nums) {
>
>         int i = 0;  // 慢指针
>         int j = 0 ; // 快指针
>         for(; j <nums.size();j++){
>             if(nums[j] != nums[i]) {
>                 i++;
>                 nums[i]= nums[j];
>             }
>         }
>         return i+1;
>     }
> };
> ```

### 💭 思路 & 感悟
-

### 📚 学到了什么（新函数 / 新数据结构 / 新套路）
- 学到了怎么使用快慢指针的移动，且察觉到了直接将快指针-->值附值给慢指针所在位置，那些快指针的值不需要管，会自然落到数组最后。

### 🔀 多种解法
-

## AI 辅助思路

- [2026-08-15] 双指针（快慢指针）：慢指针 i 指向最后一个不重复元素的坑位，快指针 j 扫描全数组；当 nums[j] != nums[i] 时 i 前移并写入 nums[i]=nums[j]，最后返回 i+1。一次遍历 O(n)、原地 O(1)，本题最优解。小注意：j 是 int 与 nums.size()(size_t) 比较有符号告警，建议 for(size_t j...) 或 int n=nums.size()。套路可推广到 #80 删除有序数组重复项 II（保留2个：if i<2 || nums[j]!=nums[i-2]）。
