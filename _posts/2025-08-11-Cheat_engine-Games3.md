---
layout: post
title: "[Cheat Engine] Games: Step 3"
date: 2025-08-11 20:00:00 +0900
categories: [Reversing, CheatEngine]
tags: [Reversing, CheatEngine, Tutorial, Games]
comments: true
---

> 이 포스팅에서는 Cheat Engine의 Games Step 3를 다룹니다: <br> 해당 튜토리얼은 x32를 기준으로 작성합니다.
>  
> - Step 3 요구사항  
> - Step 3 풀이  
> - 결과  
> - 마무리  
{: .prompt-info}

## Step 3: 개요 및 요구사항
Cheat Engine의 Games Step 3(`gtutorial-i386.exe`)를 열면 다음과 같은 창이 나타납니다.

![Step 3 게임 실행 화면](assets/img/CheatEngine/Games3/1.png)  
*게임 실행 시 화면*

창에 표시된 지시사항은 다음과 같습니다:

> Mark all platforms green to unlock the door.  
> Beware: Enemies are 1 hit kill (and bad losers).  
> Hint: There are multiple solutions. e.g.: Find collision detect with enemies, or teleport, or fly or ...  
> (Click to hide)

### 게임 동작 방식 파악
게임을 실행하고 동작 방식을 파악해보았습니다:
- 플레이어를 이동시켜 발판을 밟으면 발판이 녹색으로 변합니다.
- 모든 발판을 녹색으로 변경하면 문이 활성화되어야 하지만, 장애물(적)이 문을 가로막아 접근이 불가능합니다.
- 장애물에 닿으면 플레이어가 즉시 사망합니다.

### 핵심 요구사항
- **발판 활성화**: 모든 발판을 녹색으로 변경하여 문을 활성화.
- **장애물 처리**: 장애물과의 충돌로 사망하지 않도록 조작.
- **힌트 활용**: "Find collision detect with enemies"를 활용하여 충돌 로직 조작.

---

## Step 3: 풀이

### 1. 해결 방법 고민
힌트에서 "충돌 감지 조작"이 언급되었으므로, 장애물과의 충돌로 인해 사망하는 로직을 조작하는 방향으로 접근했습니다.  
충돌 → 사망 로직을 찾기 위해, 개발자가 어떻게 구현했을지 추측했습니다.
- 플레이어의 생존 상태(`alive`)는 `Player` 구조체에 저장되어 있을 가능성이 높습니다.
- 예: `struct Player { int x; int y; int alive; }`.
- 접근법:
  1. 플레이어 좌표를 찾아 구조체 분석.
  2. 생존 상태(`alive`) 값을 직접 찾음.

더 직관적인 방법으로, 생존 상태 값을 찾는 방향을 선택했습니다.

---

### 2. 생존 상태 값 검색 (Unknown Initial Value)
`Unknown Initial Value` 스캔을 통해 생존 상태 값을 찾았습니다:
- **Scan Type**: `Unknown Initial Value`, **Value Type**: `4 Bytes`.
- 생존 시와 사망 시 값을 비교하며 `Changed Value`와 `Unchanged Value`로 필터링.
- 결과: 약 700개의 주소 발견.

![Unknown Initial Value 스캔](assets/img/CheatEngine/Games3/2.png)  
*Unknown Initial Value로 생존 값 검색*

---

### 3. 주소 필터링
700개 주소에서 생존 상태 값을 좁히기 위해 규칙을 설정:
- 생존 상태는 `bool` 또는 `int`로 저장될 가능성이 높으므로, 값이 `0`(사망) 또는 `1`(생존)일 것으로 가정.
- 값이 `0` 또는 `1`인 주소만 확인.

**필터링 과정**:
- `017`로 시작하는 주소는 그래픽 관련(`igxelpgicd32.dll`)로 판단, 제외.
- `018` 또는 `019`로 시작하는 주소 중 값이 `0` 또는 `1`인 주소 약 5개 발견.
- 테이블로 내려 확인한 결과, 값이 `0`과 `1`로 변하는 주소는 2개:
  1. `018CCE48`: 충돌 시 플레이어는 보이지만 게임이 초기화됨.
  2. `018CCE68`: 충돌 시 사망 이펙트와 함께 플레이어가 사라지지만 게임은 초기화되지 않음.

![필터링된 주소](assets/img/CheatEngine/Games3/3.png)  
*필터링 후 테이블에 내린 주소*

> 두 주소 모두 생존과 관련 있지만, `018CCE68`이 사망 로직에 더 직접적으로 연관된 것으로 판단했습니다.
{: .prompt-tip}

---

### 4. 해결 방법 1: 생존 값 고정
두 주소(`018CCE48`, `018CCE68`)의 값을 `0`으로 고정(Freeze)하여 테스트:
- 장애물 충돌 시 사망 이펙트는 발생하지만, 플레이어는 화면에 남아 있으며 게임이 초기화되지 않음.
- 모든 발판을 녹색으로 변경하고 문을 통과 가능.

![생존 값 고정](assets/img/CheatEngine/Games3/4.png)  
*두값 다 `0` 고정 후 이펙트 발생 장면*

> **왜 두 값 모두 `0`으로 고정하였나요?**
> - `018CCE48` 의 경우 충돌시 플레이어가 보입니다.
> - `018CCE68` 의 경우 게임이 초기화 되지 않습니다.
{: .prompt-tip}
---

### 5. 해결 방법 2: 충돌 로직 조작
`018CCE68` 주소에 대해 `Find out what writes to this address`를 실행하여 해당 주소에 값을 쓰는 명령어를 확인했습니다:

![Find out what writes](assets/img/CheatEngine/Games3/5.png)  
*Find out what writes to this address 결과*

- 명령어: `00435A18 - C6 46 38 01 - mov byte ptr [esi+38],01`.

다음으로, 메모리 뷰에서 해당 명령어 주변을 분석하기 위해 `Show Disassembler`를 실행했습니다:

![메모리 뷰](assets/img/CheatEngine/Games3/6.png)  
*Show Disassembler로 확인한 메모리 뷰*

분석 결과:
- 바로 위에 `cmp byte ptr [esi+38],00`가 존재.
- `esi+38`은 생존 상태를 나타내며, `0`(생존)인지 비교.
- `0`이 아니면 `jne "gtutorial-i386.exe"+35C12`로 점프하여 사망 처리.

**조건문 변경**:
- `cmp byte ptr [esi+38],00`의 비교 값을 `0` → `1`로 변경하거나, `jne` → `je`로 변경.
- 변경 후, 충돌 시 사망 로직이 스킵되어 플레이어가 생존.

![조건문 변경](assets/img/CheatEngine/Games3/7.png)  
*조건문 변경 (jne → je)*

---

## 결과
두 방법 모두 성공:
- **방법 1**: 생존 값을 고정하여 충돌 무시.
- **방법 2**: 충돌 로직의 조건문을 변경하여 사망 방지.
- 모든 발판을 녹색으로 변경하고 문을 통과하여 Step 3 완료.

![Step 3 완료](assets/img/CheatEngine/Games3/8.png)  
*Step 3 완료 화면*

---

## 마무리
이번 Step 3는 Cheat Engine 튜토리얼의 마지막 단계였습니다.  
문제를 풀며 다양한 선택지를 제시하고, 여러 방면으로 사고하는 과정을 강조하고자 했습니다.  
이 글을 읽는 분들이 원하는 목표를 이루길 바랍니다. 이상입니다.