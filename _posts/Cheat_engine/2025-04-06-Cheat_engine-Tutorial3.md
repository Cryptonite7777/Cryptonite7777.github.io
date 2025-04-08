---
layout: post
title: "[Cheat Engine] Tutorial: Step 3"
date: 2025-04-06 20:33:53 +0900
categories: [Reversing, CheatEngine]
tags: [Reversing, CheatEngine, Tutorial]
comments: true
---

> 이 포스팅에서는 Cheat Engine 튜토리얼의 Step 3를 다룹니다: <br> 해당 튜토리얼은 x32를 기준으로 작성합니다.
>  
> - Step 3 요구사항  
> - Step 3 풀이  
> - 결과  
{: .prompt-info}

## Step 3: 개요 및 요구사항

Cheat Engine 튜토리얼의 Step 3(`000004D18-Tutorial-i386.exe`)를 열면 다음과 같은 창이 나타납니다.

- 창 하단에 "Health" 값이 바 형태로 표시됩니다.
- "Hit me" 버튼을 누르면 체력이 감소합니다.
- "Next" 버튼은 아직 비활성화 상태입니다.

튜토리얼 창에 나오는 지시사항을 번역하면 다음과 같습니다:  

> 값이 0~500 사이임을 알고 있으므로 필요한 주소일 가능성이 가장 높은 값을 선택하여 목록에 추가합니다.  
> 체력을 5000으로 변경합니다.

이제 이 요구사항을 하나씩 해결해보겠습니다.

---

## Step 3: 풀이

### 1. 알 수 없는 초기 값 스캔하기
"Health" 값이 0~500 사이의 임의의 값으로 시작하므로 초기 값을 모릅니다.<br>이 경우 Cheat Engine의 `Unknown initial value` 기능을 활용합니다.

- Cheat Engine에서 튜토리얼 프로세스(`000004D18-Tutorial-i386.exe`)를 선택합니다.
- **Scan Type(스캔 유형)**을 `Unknown initial value`로 설정합니다.
- **Value Type(값 유형)**을 `4 Bytes`로 설정합니다.
- **First Scan(첫 스캔)** 버튼을 클릭해 메모리에서 모든 값을 검색합니다.

![Step 3 초기 스캔](assets/img/CheatEngine/Step3/1.png)  
*Unknown initial value로 초기 스캔*

> 스캔이 완료되면 "Found(발견)" 목록에 653,312개의 주소가 나타납니다. <br> 주소가 너무 많으니 줄여야 합니다.
{: .prompt-tip}
---

### 2. Decreased value로 주소 목록 좁히기
올바른 주소를 찾기 위해 체력 값을 변경한 후 `Decreased value` 스캔을 진행합니다.

- 튜토리얼 창으로 돌아가서 **Hit me** 버튼을 한 번 누릅니다. 체력이 감소합니다.
- Cheat Engine에서 **Scan Type(스캔 유형)**을 `Decreased value`로 변경합니다.
- **Next Scan(다음 스캔)** 버튼을 클릭해 값이 감소한 주소만 필터링합니다.
- 위 과정을 주소가 적어질때까지 반복합니다.

![Step 3 Decreased value 스캔](assets/img/CheatEngine/Step3/2.png)  
*"Hit me" 클릭 후 Decreased value 스캔*

> "Found(발견)" 목록이 줄어들며, 예를 들어 4개의 주소가 남습니다. <br> 이 중 0~500 사이의 값을 가진 주소를 찾습니다.
{: .prompt-tip}
---

### 3. 주소를 선택하고 값 수정하기
필터링된 주소 중 요구사항에 맞는 주소를 선택해 수정합니다.

- "Found(발견)" 목록에서 값이 0~500 사이인 주소를 확인합니다.
- 해당 주소를 마우스 오른쪽 버튼으로 클릭하고 `Add selected addresses to the addresslist`를 선택합니다.
- 주소 목록에서 값을 더블클릭하고 `5000`으로 변경합니다.

![Step 3 주소 선택](assets/img/CheatEngine/Step3/3.png)  
*필터링된 주소에서 체력 값 선택*

![Step 3 값 변경](assets/img/CheatEngine/Step3/4.png)  
*체력 값을 5000으로 변경*

---

## 결과
체력 값이 5000으로 정상적으로 변경되면 **Next** 버튼이 활성화됩니다.