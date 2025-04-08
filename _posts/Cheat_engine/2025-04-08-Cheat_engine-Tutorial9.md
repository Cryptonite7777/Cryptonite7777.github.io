---
layout: post
title: "[Cheat Engine] Tutorial: Step 9"
date: 2025-04-08 23:10:00 +0900
categories: [Reversing, CheatEngine]
tags: [Reversing, CheatEngine, Tutorial]
comments: true
---

> 이 포스팅에서는 Cheat Engine 튜토리얼의 Step 9를 다룹니다: <br> 해당 튜토리얼은 x32를 기준으로 작성합니다.
>  
> - Step 9 요구사항  
> - Step 9 풀이  
> - 결과  
{: .prompt-info}

## Step 9: 개요 및 요구사항
Cheat Engine 튜토리얼의 Step 9(`Tutorial-i386.exe`)를 열면 다음과 같은 창이 나타납니다.

- 창 하단에 4명의 플레이어(Player 1: Dave, Player 2: Eric, Player 3: HAL, Player 4: KIT)가 표시됩니다.
- Dave와 Eric은 당신의 팀(Team 1), HAL과 KIT는 적 팀(Team 2)입니다.
- 각 플레이어의 체력 값이 표시되며, "Attack" 버튼으로 체력을 변경할 수 있습니다.
- "Restart game and autoplay" 버튼을 클릭하면 게임이 자동으로 진행됩니다.
- "Next" 버튼은 아직 비활성화 상태입니다.

튜토리얼 창에 나오는 지시사항을 번역하면 다음과 같습니다:

> 이 단계에서는 동일한 유형의 다른 객체에 사용되는 코드를 다루는 방법을 설명합니다.<br>
유닛이나 플레이어의 체력을 찾았을 때, 코드를 제거하면 적에게도 영향을 미치는 경우가 많습니다.<br>
이런 경우, 당신과 적의 객체를 구분하는 방법을 찾아야 합니다.<br>
가장 쉬운 방법은 찾은 코드가 어떤 주소에 쓰이는지 확인한 뒤, 데이터 분석 기능을 사용해 두 구조(당신의 유닛/플레이어와 적)를 비교하는 것입니다.<br>
구분 방법을 찾았다면, 어셈블러 스크립트를 삽입해 조건을 확인하고 코드를 실행하지 않거나 다른 작업(예: 원샷 킬)을 수행하도록 설정할 수 있습니다.<br>
당신의 임무는 체력을 기록하는 코드를 찾아 체력을 고정시키지 않고 게임에서 승리하도록 만드는 것입니다.<br>
계속하려면 "Restart game and autoplay"를 눌러 코드가 올바른지 테스트하세요.<br>
**팁: 체력은 float 형식입니다.**<br>
**팁2: 여러 해결책이 존재합니다.**

### 핵심 요구사항
- **플레이어는 객체 타입**: 각 플레이어는 동일한 구조를 가진 객체로, 체력과 팀 정보가 특정 오프셋에 저장되어 있습니다.
- **`dissect data/structures` 활용**: 플레이어 객체의 구조를 분석해 팀 정보를 찾아야 합니다.
- **체력 자체를 변경하지 않음**: 체력 값을 직접 고정(freeze)하지 않고, 코드 인젝션으로 조건에 따라 동작을 제어해야 합니다.
- **팀/적 구분**: 당신 팀(Dave, Eric)과 적 팀(HAL, KIT)을 구분해 적 팀의 체력만 조작해야 합니다.
- **튜토리얼 방식 준수**: 여러 해결 방법이 있지만, 튜토리얼에서 요구하는 방식을 준수합니다.

이제 이 요구사항을 하나씩 해결해보겠습니다.

---

## Step 9: 풀이

### 1. 모든 플레이어의 체력 값 검색 및 테이블로 내리기
튜토리얼에서 체력이 `float` 형식이라고 했으므로, 각 플레이어(Dave, Eric, HAL, KIT)의 체력 값을 찾아 테이블로 내립니다.

- Cheat Engine에서 튜토리얼 프로세스(`Tutorial-i386.exe`)를 선택합니다.
- **Scan Type(스캔 유형)**을 `Exact Value`로 설정합니다.
- **Value Type(값 유형)**을 `Float`로 설정합니다.
- 각 플레이어의 체력 값을 검색합니다.
  - Dave: `093F007C`
  - Eric: `0940841C`
  - HAL: `09430084`
  - KIT: `09448424`

![Step 9 모든 플레이어 체력 검색](assets/img/CheatEngine/Step9/1.png)  
*각 플레이어들의 체력 주소*

> 각 플레이어의 체력 값을 검색하여 테이블로 내리는 과정은 반복적이므로 생략했습니다.<br>
정확한 주소를 찾기 위해 값을 변경하며 주소를 좁히는 과정을 거쳤습니다.
{: .prompt-tip}

---

### 2. "Find out what writes to this address"로 체력 접근 코드 분석
Dave의 체력 주소(`093F007C`)를 기준으로 값을 쓰는 코드를 분석합니다.

- 테이블에 추가된 Dave의 주소 `093F007C`를 마우스 오른쪽 버튼으로 클릭합니다.
- 메뉴에서 `Find out what writes to this address`를 선택합니다.
- 새 창이 열리며, 처음에는 아무것도 표시되지 않습니다.
- 튜토리얼 창에서 Dave의 **Attack** 버튼을 클릭하면, 창에 `mov [ebx+04],eax` 명령어가 나타납니다.
- 이는 `ebx+04`가 체력 값을 쓰는 위치임을 의미합니다.

![Step 9 체력 접근 코드 분석](assets/img/CheatEngine/Step9/2.png)  
*"Find out what writes to this address"로 Dave의 체력 접근 코드 확인*

> `mov [ebx+04],eax`는 `ebx+04`에 값을 쓰는 명령어입니다.<br>
`ebx`는 플레이어 객체의 베이스 주소를 가리키며, `+04` 오프셋이 체력 값을 나타냅니다.
{: .prompt-tip}

---

### 3. 코드 분석을 위해 Show Disassembler 실행
찾아낸 명령어(`mov [ebx+04],eax`)를 더 자세히 분석하기 위해 디스어셈블러 창을 엽니다.

- `Find out what writes to this address` 창에서 명령어(`00429D8D - mov [ebx+04],eax`)를 선택하고, **Show disassembler** 버튼을 클릭합니다.
- 메모리 뷰 창이 열리며, 해당 명령어가 포함된 어셈블리 코드가 표시됩니다.

![Step 9 Show Disassembler](assets/img/CheatEngine/Step9/3.png)  
*Show Disassembler로 명령어 분석*

> `ebx+04`가 체력 값을 나타내므로, `ebx`를 기준으로 객체 구조를 분석해야 합니다.<br>
이를 위해 `dissect data/structures`를 사용합니다.
{: .prompt-tip}

---

### 4. Dissect Data/Structures 준비
`ebx+04`가 체력 값을 나타내므로, `ebx`를 기준으로 플레이어 객체의 구조를 분석하기 위해 `dissect data/structures`를 준비합니다.

- 메모리 뷰 창에서 **Tools** 메뉴를 클릭하고, **Dissect data/structures**를 선택합니다.
- `ebx+04`가 체력 값이므로, 기준 주소로 Dave의 체력 주소(`093F007C`)를 사용할 것입니다.

![Step 9 Dissect Data 준비](assets/img/CheatEngine/Step9/4.png)  
*Dissect Data/Structures 실행 직전*

> `dissect data/structures`를 통해 플레이어 객체의 구조를 분석하고, 팀 정보를 찾을 예정입니다.
{: .prompt-tip}

---

### 5. Dissect Data/Structures로 팀 정보 확인
각 플레이어의 체력 주소를 기준으로 `dissect data/structures`를 실행하여 팀 정보를 확인합니다.

- `dissect data/structures` 창에서 각 플레이어의 체력 주소(`093F007C`, `0940841C`, `09448424`, `09430084`)를 추가합니다.
- 기준 주소(`ebx+04`)에서 오프셋을 분석합니다:
  - `+00`: 체력 값 (Float).
  - `+0C`: 팀 값 (4 Bytes).
- 분석 결과:
  - Dave와 Eric(당신 팀)의 팀 값(`+0C`): `1`.
  - HAL과 KIT(적 팀)의 팀 값(`+0C`): `2`.

![Step 9 Dissect Data/Structures](assets/img/CheatEngine/Step9/5.png)  
*Dissect Data/Structures로 팀 정보 확인*

> `ebx+04`를 기준으로 `+0C` 오프셋에 팀 값이 저장되어 있음을 확인했습니다.<br>
즉, `ebx+10`이 팀 값을 나타내며, 이를 통해 팀을 구분할수 있습니다.
{: .prompt-tip}

---

### 6. 코드 인젝션 스크립트 추가
Dave의 체력 주소를 기준으로 코드 인젝션을 준비합니다.

- 메모리 뷰 창에서 `mov [ebx+04],eax` 명령어(`00429D8D`)를 선택합니다.
- **Ctrl+A**를 눌러 **Auto Assemble** 창을 엽니다.
- 기본 템플릿이 생성됩니다.

![Step 9 코드 인젝션 템플릿](assets/img/CheatEngine/Step9/6.png)  
*코드 인젝션 템플릿 추가*

> 코드 인젝션을 통해 팀 값을 확인하고, 적 팀의 체력만 조작할 것입니다.
{: .prompt-tip}

---

### 7. 코드 인젝션 스크립트 작성
팀 값을 확인하여 적 팀의 체력을 0으로 만드는 스크립트를 작성합니다.

- `dissect data/structures`에서 확인한 팀 값(`ebx+10`)을 기준으로 조건을 설정합니다.
- 당신 팀(팀 값 `1`)이면 원래 동작을 유지하고, 적 팀(팀 값 `2`)이면 체력을 0으로 설정합니다.

![Step 9 코드 인젝션 스크립트](assets/img/CheatEngine/Step9/7.png)  
*코드 인젝션 스크립트 작성*

#### 설명
- cmp [ebx+10],1: 팀 값(ebx+10)이 1(당신 팀)인지 확인합니다.
- je bypass: 팀 값이 1이면 bypass로 점프하여 체력 감소(mov [ebx+04],eax)를 방지합니다.
- jmp returnhere: 원래 코드 흐름으로 돌아갑니다.

---

## 결과
작성한 스크립트를 적용하고 테스트해봅니다.

- **Execute** 버튼을 눌러 스크립트를 적용합니다.
- 튜토리얼 창에서 **Restart game and autoplay** 버튼을 클릭하면 게임이 자동으로 진행됩니다.
- 스크립트가 제대로 동작하면 적 팀(HAL, KIT)의 체력이 0이 되어 사망하고, "Next" 버튼이 활성화됩니다.

![Step 9 스크립트 적용 및 테스트](assets/img/CheatEngine/Step9/8.png)  
*스크립트 적용 후 테스트 및 Next 버튼 활성화*

> 적 팀의 체력이 0이 되어 게임에서 승리하며, "Next" 버튼이 활성화되었습니다.
{: .prompt-tip}
