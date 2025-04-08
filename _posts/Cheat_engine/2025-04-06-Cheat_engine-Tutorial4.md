---
layout: post
title: "[Cheat Engine] Tutorial: Step 4"
date: 2025-04-06 21:50:29 +0900
categories: [Reversing, CheatEngine]
tags: [Reversing, CheatEngine, Tutorial]
comments: true
---

> 이 포스팅에서는 Cheat Engine 튜토리얼의 Step 4를 다룹니다: <br> 해당 튜토리얼은 x32를 기준으로 작성합니다.
>  
> - Step 4 요구사항  
> - Step 4 풀이  
> - 결과  
{: .prompt-info}

## Step 4: 개요 및 요구사항

Cheat Engine 튜토리얼의 Step 4(`000004D18-Tutorial-i386.exe`)를 열면 다음과 같은 창이 나타납니다.

- 창 하단에 "Health"와 "Ammo" 값이 있습니다.
- "Hit me" 버튼을 누르면 체력이 감소하고, "Fire" 버튼을 누르면 총알이 감소합니다.
- "Next" 버튼은 아직 비활성화 상태입니다.

튜토리얼 창에 나오는 지시사항을 번역하면 다음과 같습니다:  

>체력과 탄약 값을 각각 5000 이상으로 설정합니다. <br>
>두 값을 모두 5000 이상으로 설정하면 다음 단계로 진행할 수 있습니다.

이제 이 요구사항을 하나씩 해결해보겠습니다.

---

## Step 4: 풀이

### 1. 체력과 탄약의 주소 찾기
해당 문제를 풀기 전 자료형을 보게 된다면 체력은 Float형, 탄약은 Double 형태로 선언되어 있습니다.<br>
해당형태에 알맞게 `Value Type`을 변경 후 검색을 하게 되면 보다 쉽게 찾을수 있습니다. 

- Cheat Engine에서 튜토리얼 프로세스(`000004D18-Tutorial-i386.exe`)를 선택합니다.
- **Scan Type(스캔 유형)**을 `Exact Value`로 설정합니다.
- **Value Type(값 유형)**을 `Float` 또는 `Double`로 설정합니다.
- **First Scan(첫 스캔)** 버튼을 클릭해 메모리에서 모든 값을 검색합니다.

![Step 4 초기 검색](assets/img/CheatEngine/Step4/1.png)  
*체력주소 찾기*

![Step 4 초기 검색](assets/img/CheatEngine/Step4/2.png)  
*탄약주소 찾기*

> 각 자료형에 알맞게 검색해주면 됩니다.  <br> 이전 튜토리얼 내용과 동일하게 `New scan`을 통해 초기값을 검색하고 이후 `Hit me` 를 이용하여 값을 감소 시키면서 반복하시면 됩니다. 
{: .prompt-tip}
---

### 2. 주소를 선택하고 값 수정하기
필터링된 주소 중 요구사항에 알맞는 주소를 선택해 수정합니다.

- 해당 주소를 `Add selected addresses to the addresslist` 를 통해 테이블로 내립니다.
- 주소 목록에서 값을 더블클릭하고 `5000`으로 변경합니다.

![Step 4 이미지 설명](assets/img/CheatEngine/Step4/3.png)  
*각 주소의 벨류를 5000으로 변경*

---

## 결과
체력 값이 5000으로 정상적으로 변경되었다면 **Next** 버튼이 활성화됩니다.
