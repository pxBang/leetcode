---
复杂度-空间: O(1)
复杂度-时间: O(m+n)
状态: 已掌握
id: 88
title: "Merge Sorted Array"
url: https://leetcode.cn/problems/merge-sorted-array/description/
difficulty: Easy
tags: [Array, Two Pointers, Sorting]
attempts: 1
first_attempt: 2026-08-17
last_attempt: 2026-08-17
total_submissions: 1
total_ac: 1
total_runs: 0
---

# 88. Merge Sorted Array

> Easy · Array / Two Pointers / Sorting · [题目链接](https://leetcode.cn/problems/merge-sorted-array/description/)


> [!abstract]- 题面
> 给你两个按 **非递减顺序** 排列的整数数组 `nums1`和 `nums2`，另有两个整数 `m` 和 `n` ，分别表示 `nums1` 和 `nums2` 中的元素数目。
>
> 请你 **合并** `nums2`到 `nums1` 中，使合并后的数组同样按 **非递减顺序** 排列。
>
> **注意：**最终，合并后数组不应由函数返回，而是存储在数组 `nums1` 中。为了应对这种情况，`nums1` 的初始长度为 `m + n`，其中前 `m` 个元素表示应合并的元素，后 `n` 个元素为 `0` ，应忽略。`nums2` 的长度为 `n` 。
>
> **示例 1：**
>
> ```
> 输入：nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
> 输出：[1,2,2,3,5,6]
> 解释：需要合并 [1,2,3] 和 [2,5,6] 。
> 合并结果是 [1,2,2,3,5,6] ，其中斜体加粗标注的为 nums1 中的元素。
> ```
>
> **示例 2：**
>
> ```
> 输入：nums1 = [1], m = 1, nums2 = [], n = 0
> 输出：[1]
> 解释：需要合并 [1] 和 [] 。
> 合并结果是 [1] 。
> ```
>
> **示例 3：**
>
> ```
> 输入：nums1 = [0], m = 0, nums2 = [1], n = 1
> 输出：[1]
> 解释：需要合并的数组是 [] 和 [1] 。
> 合并结果是 [1] 。
> 注意，因为 m = 0 ，所以 nums1 中没有元素。nums1 中仅存的 0 仅仅是为了确保合并结果可以顺利存放到 nums1 中。
> ```
>
> **提示：**
>
> - `nums1.length == m + n`
> - `nums2.length == n`
> - `0 <= m, n <= 200`
> - `1 <= m + n <= 200`
> - `-109 <= nums1[i], nums2[j] <= 109`
>
> **进阶：**你可以设计实现一个时间复杂度为 `O(m + n)` 的算法解决此问题吗？

讲解视频: [YouTube](https://www.youtube.com/results?search_query=leetcode%2088.%20Merge%20Sorted%20Array) · [Bilibili](https://search.bilibili.com/all?keyword=leetcode%2088.%20Merge%20Sorted%20Array)

## 第 1 次 · 2026-08-17 周一
⏱ 开始 11:45 → 首提 11:45 · 编码 1 分钟 → AC 11:45 · 提交 1 次 / 通过 1 次 · 本题停留 181 分钟

### ✅ 通过代码 · C++ · 11:45（0 ms · 12.1 MB）
> [!success]- 代码
> ```cpp
> class Solution {
> public:
>     void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
>         int p1 = m - 1;
>         int p2 = n - 1;
>         int p = m + n - 1;
>         while (p2 >= 0) {
>             if (p1 >= 0 && nums1[p1] >= nums2[p2]) {
>                 nums1[p] = nums1[p1];
>                 p--;
>                 p1--;
>
>             } else {
>                 nums1[p] = nums2[p2];
>                 p--;
>                 p2--;
>             }
>         }
>     }
> };
> ```

### 💭 思路 & 感悟
-

### 📚 学到了什么（新函数 / 新数据结构 / 新套路）
- 对于两个数组合并到一个数组中去，应该使用三指针
- 由于第一个数组的尾部是空，那么从指针尾向首是一个更好的思路
- 这题的边界条件也是一个坑，需要额外注意。
	- 首先外层循环的结束应该以数组2插完为结束条件，即while(p2>=0). 
	- 内层的判断插数组1还是插数组2，对于数组1，还需要用p1>=0来守护数组1的边界
### 🔀 多种解法
-

## AI 辅助思路

- [2026-08-17] 反向三指针（从尾到头合并）即本题最优解：p1=m-1 指向 nums1 最后一个有效元素，p2=n-1 指向 nums2 末尾，p=m+n-1 指向最终槽位。循环条件 while(p2>=0)：nums2 合并完即停，nums1 前段已有序无需处理；if(p1>=0 && nums1[p1]>=nums2[p2]) 里的 p1>=0 守卫恰好兜住 m=0（nums1 全为占位 0）的边界，走 else 分支把 nums2 拷入。从尾往前填保证不覆盖未处理元素，实现原地合并 O(m+n)/O(1)。对比朴素做法（把 nums2 拷到尾部再 sort，O((m+n)log(m+n))）此解最优。套路与「合并两个有序链表」同源：都是谁大取谁、反向/双指针避免额外数组。
