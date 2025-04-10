---
layout: post
title: "[Cheat Engine] Games: Step 1"
date: 2025-04-10 16:00:00 +0900
categories: [Reversing, CheatEngine]
tags: [Reversing, CheatEngine, Tutorial, Games]
comments: true
---

> 이 포스팅에서는 Cheat Engine의 Games Step 1을 다룹니다: <br> 해당 튜토리얼은 x32를 기준으로 작성합니다.
>  
> - Step 1 요구사항  
> - Step 1 풀이  
> - 결과  
{: .prompt-info}

## Step 1: 개요 및 요구사항
Cheat Engine의 Games Step 1(`gtutorial-i386.exe`)를 열면 다음과 같은 창이 나타납니다.

![Step 1 게임 실행 화면](assets/img/CheatEngine/Games1/1.png) 
*게임 실행 시 화면*

창에 표시된 지시사항은 다음과 같습니다.

> Every 5 shots you have to reload, after which the target will heal.  
> Try to find a way to destroy the target.  
> (Click to hide)

### 게임 동작 방식 파악
게임을 실행하고 동작 방식을 파악해보았습니다.

- 타겟을 클릭하면 타겟의 체력이 감소합니다(체력 바는 상단에 표시됨).
- 총알은 "Ammo till reload"로 표시되며, 초기값은 5발입니다.
- 한 발을 쏠 때마다 총알이 1씩 감소하며, 5발을 모두 사용하면 재장전(reload)이 발생합니다.
- 재장전 시 타겟의 체력이 완전히 회복됩니다.

### 핵심 요구사항
- **타겟 파괴**: 타겟의 체력을 0으로 만들어야 합니다.
- **총알값 변조 또는 체력 조작**: 재장전으로 인해 타겟의 체력이 회복되지 않도록 하거나, 타겟의 체력을 직접 조작해야 합니다.

이제 이 요구사항을 하나씩 해결해보겠습니다.

---

## Step 1: 풀이

### 1. 해결 방법 고민
게임의 동작 방식을 바탕으로 문제를 해결할 수 있는 두 가지 접근법을 생각해볼 수 있습니다.

1. **타겟의 체력 값을 조작**: 타겟의 체력 값을 직접 변경하여 0으로 만듭니다.
2. **총알 값을 조작**: 총알 값을 변조하거나, 재장전이 되지 않도록 한다.

첫 번째 방법의 경우, 게임 화면에서 타겟의 체력 값이 숫자로 표시되지 않기 때문에 값을 찾기가 어렵습니다.<br>
반면, 두 번째 방법은 화면에 "Ammo till reload"로 총알 값이 표시되므로 더 쉽게 접근할 수 있습니다.<br>
따라서 두 번째 방법으로 진행하겠습니다.

---

### 2. 총알 값 검색 시도 (4 Bytes)
총알 값이 5발에서 시작하여 한 발 쏠 때마다 1씩 감소하는 것을 확인했습니다. 따라서 다음과 같이 검색을 시도했습니다.
- **Scan Type(스캔 유형)**: `Exact Value`
- **Value Type(값 유형)**: `4 Bytes`
- 초기 총알 값 `5`를 검색 → 결과: 여러 주소.
- 한 발 쏜 후 총알 값 `4`로 검색 → 결과: "Found: 0".

![Step 1 총알 값 검색 실패](assets/img/CheatEngine/Games1/2.png)  
*총알 값 검색 (5 → 4) 후 Found: 0*

> 4 Bytes로 검색했지만 결과가 나오지 않았습니다.<br>
이는 게임에서 총알 값이 단순히 5에서 4로 감소하는 방식이 아니라, 다른 방식으로 처리되고 있을 가능성이 높습니다.  
> 또한, 중요한 데이터에 대한 보안(예: 암호화 또는 다른 형식)이 적용되었을 수도 있습니다.
{: .prompt-tip}

---

### 3. Unknown Initial Value 스캔으로 접근
이전에 진행한 Cheat Engine 튜토리얼에서 배운 방법을 활용하여, 값의 변화를 기준으로 검색하는 방식으로 변경했습니다.
- **Scan Type(스캔 유형)**: `Unknown Initial Value`
- **Value Type(값 유형)**: `4 Bytes` (총알 값이 정수로 보이므로 4 Bytes로 설정).
- 초기 스캔 후, 한 발 쏘고 **Changed Value**로 스캔 → 주소 좁히기.
- 총알 값이 5 → 4 → 3으로 변할 때마다 반복적으로 스캔.

이 과정을 통해 주소 `019043C4`를 찾았습니다.

![Step 1 Unknown Initial Value 스캔 결과](assets/img/CheatEngine/Games1/3.png)  
*Unknown Initial Value 스캔으로 찾은 총알 값 주소*

---

### 4. 총알 값 분석
주소 `019043C4`를 분석해보니, 총알 값이 예상과 다르게 동작하고 있음을 알게 되었습니다.
- 화면상에서는 총알이 5 → 4 → 3으로 감소하는 것처럼 보이지만,<br>
메모리에서는 값이 0 → 1 → 2로 **증가**하고 있었습니다.
- 게임 내부에서는 "남은 총알 수"를 감소시키는 대신, "사용한 총알 수"를 증가시키는 방식으로 처리되고 있었습니다.

이를 확인하기 위해 `Find out what writes to this address` 기능을 사용했습니다:
- 주소 `019043C4`를 선택하고, `Find out what writes to this address`를 실행.
- 총알을 한 발 쏘면 해당 주소에 값을 쓰는 명령어가 나타남.
- 메모리 뷰에서 관련 코드를 확인하니, `{ ("Ammo till reload: %d") }`라는 주석이 포함되어 있었습니다.<br>
이는 해당 값이 실제로 "Ammo till reload" 값을 나타냄을 확인시켜줍니다.

> 4 Bytes 스캔으로 값이 검색되지 않았던 이유는 값이 감소(5 → 4)가 아니라 증가(0 → 1)로 처리되었기 때문입니다.  
> `Unknown Initial Value`와 `Changed Value` 스캔 방식을 통해 이를 해결할 수 있었습니다.
{: .prompt-tip}

---

### 5. 총알 값 고정(Freeze)
총알 값을 고정하여 재장전이 발생하지 않도록 설정했습니다.

- 주소 `019043C4`를 테이블에 추가.
- 값을 `0`으로 설정하고, **Freeze** 체크박스를 활성화.
- 총알 값을 고정하면 더 이상 타겟의 체력이 회복되지 않습니다.

![Step 1 총알 값 Freeze](assets/img/CheatEngine/Games1/4.png)  
*총알 값 Freeze 후*

---

## 결과
총알 값을 고정한 상태에서 타겟을 계속 공격하면 됩니다.

- 타겟의 체력 바가 점차 감소하며, 결국 체력이 0이 되어 타겟이 파괴됨.
- Step 1이 완료되며, 다음 단계로 넘어갈 수 있습니다.
