---
复杂度-空间: O(n)
复杂度-时间: O(n)
状态: 已掌握
id: 1
title: "Two Sum"
url: https://leetcode.cn/problems/two-sum/description/
difficulty: Easy
tags: [Array, Hash Table]
attempts: 2
first_attempt: 2026-08-15
last_attempt: 2026-08-17
total_submissions: 2
total_ac: 2
total_runs: 11
---

# 1. Two Sum

> Easy · Array / Hash Table · [题目链接](https://leetcode.cn/problems/two-sum/description/)


> [!abstract]- 题面
> 给定一个整数数组 `nums` 和一个整数目标值 `target`，请你在该数组中找出 **和为目标值***`target`*  的那 **两个** 整数，并返回它们的数组下标。
>
> 你可以假设每种输入只会对应一个答案，并且你不能使用两次相同的元素。
>
> 你可以按任意顺序返回答案。
>
> **示例 1：**
>
> ```
> 输入：nums = [2,7,11,15], target = 9
> 输出：[0,1]
> 解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。
> ```
>
> **示例 2：**
>
> ```
> 输入：nums = [3,2,4], target = 6
> 输出：[1,2]
> ```
>
> **示例 3：**
>
> ```
> 输入：nums = [3,3], target = 6
> 输出：[0,1]
> ```
>
> **提示：**
>
> - `2 <= nums.length <= 104`
> - `-109 <= nums[i] <= 109`
> - `-109 <= target <= 109`
> - **只会存在一个有效答案**
>
> **进阶：**你可以想出一个时间复杂度小于 `O(n2)` 的算法吗？

讲解视频: [YouTube](https://www.youtube.com/results?search_query=leetcode%201.%20Two%20Sum) · [Bilibili](https://search.bilibili.com/all?keyword=leetcode%201.%20Two%20Sum)

## 第 1 次 · 2026-08-15 周六
⏱ 开始 19:59 → 首提 20:05 · 编码 6 分钟 → AC 20:05 · 提交 1 次 / 通过 1 次 · 运行 4 次 · 本题停留 19 分钟

### ✅ 通过代码 · C++ · 20:05（55 ms · 13.8 MB）
> [!success]- 代码
> ```cpp
> class Solution {
> public:
>     vector<int> twoSum(vector<int>& nums, int target) {
>         for(int i=0;i<nums.size();i++){
>             for(int j=i+1;j<nums.size();j++){
>                 if (nums[i] + nums[j] == target) return {i,j};
>             }
>         }
>         return {};
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

- [2026-08-17] 已从暴力 O(n²) 升级到哈希表一次遍历 O(n)/O(n)，0 ms。核心「补数」套路：遍历时先查 target-nums[i] 是否已在 unordered_map（值→下标），查不到再插入当前元素。「先查后插」是正确性关键——保证每个元素只和它前面的元素配对、不会和自己匹配（否则 [3,3] target=6 会错误返回同一个下标两次）。这是 Two Sum 必背模板，可推广到 167 两数之和 II（有序则双指针）与 15 三数之和（排序+双指针）。

- [2026-08-15] 你的解法是双重循环暴力 O(n²) 时间 / O(1) 空间，能 AC 但不是最优。最优是哈希表一次遍历 O(n)/O(n)：遍历时把「值→下标」存进 unordered_map，每步查 target - nums[i] 是否已存在。这是 Two Sum 的必背模板，务必掌握。


## 第 2 次 · 2026-08-17 周一
⏱ 开始 14:46 → 首提 14:59 · 编码 14 分钟 → AC 14:59 · 提交 1 次 / 通过 1 次 · 运行 7 次 · 本题停留 18 分钟

### ✅ 通过代码 · C++ · 14:59（0 ms · 14.6 MB）
> [!success]- 代码
> ```cpp
> class Solution {
> public:
>     vector<int> twoSum(vector<int>& nums, int target) {
>         unordered_map <int, int> dic; //key为值，value为下标
>
>         for(int i = 0; i<nums.size(); i++){
>             //一次循环：先查找，再插入
>             if (dic.find(target - nums[i]) != dic.end()) {
>                 return {i, dic[target -nums[i]]};
>             }
>             dic.insert({nums[i],i});
>         }
>
>         return {};
>     }
> };
> ```

### 💭 思路 & 感悟
-

### 📚 学到了什么（新函数 / 新数据结构 / 新套路）
-

### 🔀 多种解法
-
