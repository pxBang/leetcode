---
复杂度-空间: O(1)
复杂度-时间: O(n)
状态: 已掌握
id: 169
title: "Majority Element"
url: https://leetcode.cn/problems/majority-element/description/
difficulty: Easy
tags: [Array, Hash Table, Divide and Conquer, Counting, Sorting, 摩尔投票算法]
attempts: 1
first_attempt: 2026-08-18
last_attempt: 2026-08-18
total_submissions: 2
total_ac: 2
total_runs: 7
---

# 169. Majority Element

> Easy · Array / Hash Table / Divide and Conquer / Counting / Sorting / 摩尔投票算法 · [题目链接](https://leetcode.cn/problems/majority-element/description/)


> [!abstract]- 题面
> 给定一个大小为 `n`的数组 `nums` ，返回其中的多数元素。多数元素是指在数组中出现次数 **大于** `⌊ n/2 ⌋` 的元素。
>
> 你可以假设数组是非空的，并且给定的数组总是存在多数元素。
>
> **示例 1：**
>
> ```
> 输入：nums = [3,2,3]
> 输出：3
> ```
>
> **示例 2：**
>
> ```
> 输入：nums = [2,2,1,1,1,2,2]
> 输出：2
> ```
>
> **提示：**
>
> - `n == nums.length`
> - `1 <= n <= 5 * 104`
> - `-109 <= nums[i] <= 109`
> - 输入保证数组中一定有一个多数元素。
>
> **进阶：**尝试设计时间复杂度为 O(n)、空间复杂度为 O(1) 的算法解决此问题。

讲解视频: [YouTube](https://www.youtube.com/results?search_query=leetcode%20169.%20Majority%20Element) · [Bilibili](https://search.bilibili.com/all?keyword=leetcode%20169.%20Majority%20Element)

## 第 1 次 · 2026-08-18 周二
⏱ 开始 11:04 → 首提 11:09 · 编码 6 分钟 → AC 11:09 · 提交 2 次 / 通过 2 次 · 运行 7 次

### ✅ 通过代码 · C++ · 11:31（0 ms · 27.7 MB）
> [!success]- 代码
> ```cpp
> class Solution {
> public:
>     int majorityElement(vector<int>& nums) {
>         int candidate = nums[0];
>         int count = 0;
>         for (int i = 0; i < nums.size(); i++) {
>             if (nums[i] == candidate)
>                 count++;
>             else
>                 count--;
>
>             if (count == 0)
>                 candidate = nums[i + 1];
>         }
>         return candidate;
>     }
> };
> ```

### ✅ 通过代码 · C++ · 11:09（3 ms · 27.8 MB）
> [!success]- 代码
> ```cpp
> class Solution {
> public:
>     int majorityElement(vector<int>& nums) {
>         unordered_map<int, int> dic;
>         for(int i = 0; i< nums.size(); i++){
>             dic[nums[i]]++;
>             if(dic[nums[i]] > nums.size()/2) return nums[i];
>         }
>         return 0;
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

- [2026-08-18] 摩尔投票法解法已到位：O(n) 时间 / O(1) 空间，是本题最优解（比之前的 unordered_map 计数 O(n) 空间更进一步）。核心是 candidate 候选人 + count 票数余额：相同 count++、不同 count--，count==0 时换将。但你的实现有两处要留意：① 你把「换将」写在循环体底部 count 归零之后（candidate = nums[i+1]），且没显式把 count 重置为 1——正确性依赖下一轮 nums[i+1]==candidate 自动把 count 从 0 拉回 1，能 AC 但非主流；同时 nums[i+1] 有越界隐患：若 count 在最后一个下标归零就会读 nums[n]（本题保证多数元素存在、末尾 count 必 >=1 故不触发，但换成「不保证多数」的变体题就会炸）。② 更稳的模板是把判断放循环顶部：if(count==0){ candidate=nums[i]; count=1; }，再 count += (nums[i]==candidate ? 1 : -1)，天然无越界、也不依赖下一轮自愈。一句话本质：多数元素出现次数 > n/2，比其他所有元素总数还多，两两抵消后必有剩余，最后 candidate 就是多数元素。

- [2026-08-18] 哈希表计数解法正确但非最优：O(n) 时间 / O(n) 空间，未满足进阶要求的 O(1) 空间。最优是 Boyer-Moore 摩尔投票法 O(n)/O(1)：设候选 candidate 与计数 count，遍历时 count==0 就换候选（candidate=nums[i], count=1），遇到相同值 count++、不同值 count--；因为多数元素出现次数 > n/2，抵消后最后剩下的 candidate 一定是多数元素。可一句话验证：多数元素个数比其他所有元素总数还多，两两抵消后必有剩余。小细节：你的 if(dic[nums[i]] > nums.size()/2) 是 int 与 size_t(无符号) 比较，虽因计数非负而正确，但建议 int n = nums.size() 先取整避免有符号/无符号告警。若还要一次遍历不提前 return，最后返回 candidate 即可。
