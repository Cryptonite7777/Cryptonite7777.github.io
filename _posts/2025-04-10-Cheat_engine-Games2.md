---
layout: post
title: "[Cheat Engine] Games: Step 2"
date: 2025-04-10 20:00:00 +0900
categories: [Reversing, CheatEngine]
tags: [Reversing, CheatEngine, Tutorial, Games]
comments: true
---

> 이 포스팅에서는 Cheat Engine의 Games Step 2를 다룹니다: <br> 해당 튜토리얼은 x32를 기준으로 작성합니다.
>  
> - Step 2 요구사항  
> - Step 2 풀이  
> - 결과  
{: .prompt-info}

## Step 2: 개요 및 요구사항
Cheat Engine의 Games Step 2(`gtutorial-i386.exe`)를 열면 다음과 같은 창이 나타납니다.

![Step 2 게임 실행 화면](assets/img/CheatEngine/Games2/1.png)  
*게임 실행 시 화면*

창에 표시된 지시사항은 다음과 같습니다.

> These two enemies have more health and do more damage to you than you do to them. Destroy them.  
> Tip/Warning: Enemy and player are related  
> (Click to hide)

### 게임 동작 방식 파악
게임을 실행하고 동작 방식을 파악해보았습니다.

- 플레이어가 총알을 한 발 쏘면, 적으로부터 각각 1발씩 공격을 받아 플레이어의 체력이 감소합니다.
- 플레이어의 체력은 우측 하단에 "Player Health"로 표시되며, 초기값은 100입니다.
- 적의 체력은 상단에 체력 바로 표시됩니다.

### 핵심 요구사항

- **적 파괴**: 두 적의 체력을 0으로 만들어 파괴해야 합니다.
- **팁 활용**: "Enemy and player are related"라는 팁을 활용하여 문제를 해결해야 합니다.

이제 이 요구사항을 하나씩 해결해보겠습니다.

---

## Step 2: 풀이

### 1. 해결 방법 고민
게임의 동작 방식을 바탕으로 문제를 해결할 수 있는 몇 가지 접근법을 생각해볼 수 있습니다.

1. **플레이어 체력 변조**: 플레이어의 체력 값을 고정하거나 높여서 적의 공격을 무력화 하는방법.
2. **적 체력 변조**: 적의 체력 값을 직접 줄여서 빠르게 파괴하는 방법.

우선 일반적인 방법(체력 변조)으로 접근해보고, 이후 팁을 활용한 방법으로 문제를 해결해보겠습니다.

---

### 2. 플레이어 체력 검색 (4 Bytes)
우측 하단에 표시된 플레이어 체력 값을 기준으로 검색을 시작했습니다.
- **Scan Type(스캔 유형)**: `Exact Value`
- **Value Type(값 유형)**: `4 Bytes` (체력 값이 정수로 보이므로 4 Bytes로 설정).
- 초기 체력 값 `100`을 검색 → 여러 주소 발견.
- 적에게 공격받아 체력이 감소한 후(예: `92`) 다시 검색 → 주소 `01AECD80` 발견.

![Step 2 플레이어 체력 검색](assets/img/CheatEngine/Games2/2.png)  
*플레이어 체력 검색 후 테이블로 내린 결과*

> **"어떤 튜토리얼은 Float, 어떤 튜토리얼은 4 Bytes인데, 뭘로 해야 맞을까?"**  
> 게임 데이터 형식은 개발자마다 달라서 정확히 알기 어렵습니다.<br>다양한 스캔 방법을 시도하며 경험을 쌓는 것이 중요합니다.
{: .prompt-tip}

---

### 3. 플레이어 체력 분석 및 테스트
찾은 주소 `01AECD80`에 대해 `Find out what writes to this address`를 실행하여<br>
체력 감소 로직을 분석했습니다.

- 적에게 공격받을 때 해당 주소에 값을 쓰는 명령어가 나타남.
- 확인된 명령어: `0043A480 - 29 50 50 - sub [eax+50],edx`.

![Step 2 Find out what writes](assets/img/CheatEngine/Games2/3.png)  
*플레이어 체력 주소에 대한 Find out what writes 결과*

분석 결과:
- `eax+50`: 플레이어의 체력 값을 저장하는 메모리 위치.
- `edx`: 플레이어가 받는 데미지 값.

#### 체력 변조 테스트
찾은 체력 값을 `99999`로 변경하고 게임을 진행해보았습니다.
- Target 1을 공격하여 파괴.
- Target 2의 공격을 한 번만 받아도 플레이어가 즉시 사망.

![Step 2 적 1 파괴 후](assets/img/CheatEngine/Games2/4.png)  
*Target 1 파괴 후*

![Step 2 플레이어 사망 직전](assets/img/CheatEngine/Games2/5.png)  
*Target 2의 공격으로 플레이어가 사망 직전인 화면*

> 단순히 플레이어 체력을 높이는 방법으로는 문제를 해결할 수 없었습니다.  
> Target 2가 무적 상태로 변경되는 이유와 플레이어가 즉시 사망하는 이유를 더 분석해야 합니다.
{: .prompt-warning}

---

### 4. 팁 활용: "Enemy and player are related"
일반적인 체력 변조로는 해결이 어려운 상황에서, "Enemy and player are related"라는 팁을 활용해보겠습니다.  
이 팁은 플레이어와 적이 동일한 객체 구조를 공유할 가능성을 이야기 합니다.  
이를 확인하기 위해 `sub [eax+50],edx` 명령어에 대해 더 깊이 분석해보겠습니다.

####  체력 감소 로직 변경
`sub [eax+50],edx`를 `add [eax+50],edx`로 변경하여 테스트해보았습니다.

- 플레이어와 적이 서로 공격할 때, 체력이 감소하는 대신 **증가**하는 현상을 확인.
- 이는 플레이어와 적이 동일한 체력 감소 로직(`eax+50`)을 공유하고 있음을 의미합니다.

> 플레이어와 적이 동일한 객체 구조를 사용하며, 체력 감소 로직도 공유하고 있음을 확인했습니다.  
> 이를 활용하여 플레이어의 체력 감소를 방지하는 방향으로 접근해보겠습니다.
{: .prompt-tip}

---

### 5. 체력 감소 로직 분석
`sub [eax+50],edx` 명령어에 대해 `Find out what addresses this instruction accesses`를 실행하여,<br>
어떤 주소들이 영향을 받는지 확인했습니다.

- 플레이어와 적에게 공격을 주고받으며 분석.
- 결과적으로 세 개의 주소(`01AEE910`, `01AECD80`, `01AEEC20`)가 나타남.
- 각각 플레이어, 적 1, 적 2의 체력 주소로 추정.

![Step 2 Find out what addresses](assets/img/CheatEngine/Games2/6.png)  
*Find out what addresses this instruction accesses 실행 직전*

![Step 2 체력 주소 확인](assets/img/CheatEngine/Games2/7.png)  
*플레이어와 적의 체력 주소 확인*

---

### 6. 구조체 분석 (Dissect Data/Structures)
세 주소가 동일한 객체 구조를 공유할 가능성을 확인하기 위해, 주소를 드래그하고<br>
`Ctrl+D`를 눌러 `Dissect Data/Structures`를 실행했습니다.

![Step 2 Dissect Data 직전](assets/img/CheatEngine/Games2/8.png)  
*Dissect Data/Structures 실행 직전*

분석 결과:
- 구조체의 시작 주소는 다르지만, 오프셋 `+50`에서 각 객체의 체력 값을 확인.
- 오프셋 `+5C`에서 팀 값을 확인: 플레이어는 `0`, 적은 `1`.

![Step 2 Dissect Data 결과](assets/img/CheatEngine/Games2/9.png)  
*Dissect Data/Structures 결과*

> 오프셋 `+5C`는 팀 값을 나타내며, 이를 통해 플레이어와 적을 구분할 수 있습니다.  
> 이 값을 기준으로 플레이어의 체력 감소를 방지하는 스크립트를 작성할 수 있습니다.
{: .prompt-tip}

---

### 7. 코드 인젝션 스크립트 작성
`eax+5C` 값을 기준으로, 팀 값이 `0`(플레이어)일 경우 `sub [eax+50],edx` 로직을 건너뛰도록 코드 인젝션 스크립트를 작성했습니다.
- 팀 값이 `0`이면 체력 감소 로직을 스킵.
- 팀 값이 `1`(적)일 경우 체력 감소 로직을 정상적으로 실행.

![Step 2 코드 인젝션 스크립트](assets/img/CheatEngine/Games2/10.png)  
*코드 인젝션 스크립트 작성*

---

## 결과
코드 인젝션 스크립트를 적용한 후:
- 플레이어의 체력은 감소하지 않으며, 적의 체력만 감소.
- 적 1과 적 2를 차례로 파괴.

![Step 2 완료](assets/img/CheatEngine/Games2/11.png)  
*Step 2 완료*
