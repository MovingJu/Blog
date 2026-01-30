---
layout: post
title:  "[Algorithm] 백준 1043 - 거짓말"
tagline: Algorithm
author: MovingJu
categories: [Algorithm]
lastmode: 2025-07-28 12:00:00
sitemap:
  changefreq: daily
  priority : 1.0
comments: true
---

**글쓴이** : MovingJu

<a href="https://www.acmicpc.net/problem/1043"><img src="/image/baekjoon.png" alt="image" width="600" height="auto" style="display: block; margin: 0 auto;" href="https://www.acmicpc.net/problem/1043"></a>


# 문제

- 번호 : 1043
- 이름 : 거짓말
- 난이도 : 골드 4
- 링크 : [baekjoon](https://www.acmicpc.net/problem/1043)


# 문제 설명

지민이는 파티에 가서 이야기 하는 것을 좋아한다. 파티에 갈 때마다, 지민이는 지민이가 가장 좋아하는 이야기를 한다. 지민이는 그 이야기를 말할 때, 있는 그대로 진실로 말하거나 엄청나게 과장해서 말한다. 당연히 과장해서 이야기하는 것이 훨씬 더 재미있기 때문에, 되도록이면 과장해서 이야기하려고 한다. 

하지만, 지민이는 거짓말쟁이로 알려지기는 싫어한다. 문제는 몇몇 사람들은 그 이야기의 진실을 안다는 것이다. 따라서 이런 사람들이 파티에 왔을 때는, 지민이는 진실을 이야기할 수 밖에 없다. 당연히, **어떤 사람이 어떤 파티에서는 진실을 듣고, 또 다른 파티에서는 과장된 이야기를 들었을 때도 지민이는 거짓말쟁이로 알려지게 된다.** 지민이는 이런 일을 모두 피해야 한다.

사람의 수 N이 주어진다. 그리고 그 이야기의 진실을 아는 사람이 주어진다. 그리고 각 파티에 오는 사람들의 번호가 주어진다. 지민이는 모든 파티에 참가해야 한다. 이때, 지민이가 거짓말쟁이로 알려지지 않으면서, 과장된 이야기를 할 수 있는 파티 개수의 최댓값을 구하는 프로그램을 작성하시오.

-----

# 풀이

예제 입력만으론 정확하게 문제를 풀기 어려워 보인다. 자세히 소개해보고자 한다.

예를 들어, 

```yml
5 4
1 1
2 4 5
2 2 4
2 2 3
2 1 3
```
이 경우 지민이가 허풍을 떨 수 있는 파티는 몇개일까?

<details>
    <summary><strong>정답</strong></summary>
    <p><strong>0개 이다.</strong></p>
    <p>맨 마지막 줄에서 1이 3에게 진실 전파, 3이 2에게 전파, 2가 4에게 전파, 4가 5에게 전파한다.</p>
</details>



이상.