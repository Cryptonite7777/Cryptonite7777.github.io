---
layout: post
title: "[Cheat Engine] Tutorial: Step 8"
date: 2025-08-08 19:00:00 +0900
categories: [Reversing, CheatEngine]
tags: [Reversing, CheatEngine, Tutorial]
comments: true
---

> 이 포스팅에서는 Cheat Engine 튜토리얼의 Step 8를 다룹니다: <br> 해당 튜토리얼은 x32를 기준으로 작성합니다.
>  
> - Step 8 요구사항  
> - Step 8 풀이  
> - 결과  
{: .prompt-info}

## Step 8: 개요 및 요구사항
Cheat Engine 튜토리얼의 Step 8(`000004EA-Tutorial-i386.exe`)를 열면 다음과 같은 창이 나타납니다.

- 창 하단에 체력 값이 표시됩니다.
- "Change Value" 버튼을 클릭하면 체력 값이 변경됩니다.
- "Change Pointer" 버튼을 클릭하면 포인터와 값이 변경됩니다.
- "Next" 버튼은 아직 비활성화 상태입니다.

튜토리얼 창에 나오는 지시사항을 번역하면 다음과 같습니다:

> 이 단계에서는 다중 레벨 포인터(multi-level pointers)를 사용하는 방법을 배웁니다.<br>
Step 6에서는 1단계 포인터를 다루었지만, 이번에는 4단계 포인터를 다룹니다.<br>
값을 접근하는 코드를 찾고, 포인터와 오프셋을 추적하여 베이스 주소(녹색 주소)까지 도달해야 합니다.<br>
"Change Value" 버튼을 눌러 체력 값을 접근하고, 포인터 경로를 찾은 후 "Change Pointer" 버튼을 눌러 테스트합니다.<br>
포인터와 값이 변경된 후 3초 내에 값을 5000으로 고정(freeze)해야 "Next" 버튼이 활성화됩니다.

이제 이 요구사항을 하나씩 해결해보겠습니다.

---

## Step 8: 풀이

### 1. 초기 값 검색 및 테이블로 내리기
현재 튜토리얼에 나타난 체력 값이 3883으로 시작하니, 이 값을 Cheat Engine으로 찾아보겠습니다.

- Cheat Engine에서 튜토리얼 프로세스(`000004EA-Tutorial-i386.exe`)를 선택합니다.
- **Scan Type(스캔 유형)**을 `Exact Value`로 설정합니다.
- **Value Type(값 유형)**을 `4 Bytes`로 설정합니다.
- 검색할 값을 `3883`으로 입력합니다.
- **First Scan(첫 스캔)** 버튼을 클릭해 메모리에서 값을 검색합니다.
- 검색 결과에서 주소 `018ECA38`을 선택하고, `Add selected addresses to the addresslist`를 통해 테이블로 내립니다.

![Step 8 초기 검색](assets/img/CheatEngine/Step8/1.png)  
*초기 값 3883 검색 후 테이블로 내리기*

> 스캔이 완료되면 "Found(발견)" 목록에 여러 주소가 나타납니다.<br>
값을 변경하여 주소를 좁힌 후 테이블로 내립니다.
{: .prompt-tip}
---

### 2. "Find out what accesses this address"로 1단계 포인터 분석
테이블에 추가한 주소에서 값을 접근하는 코드를 찾아 분석합니다.

- 테이블에 추가된 주소 `018ECA38`을 마우스 오른쪽 버튼으로 클릭합니다.
- 메뉴에서 `Find out what accesses this address`를 선택합니다.
- 새 창이 열리며, 처음에는 아무것도 표시되지 않습니다.
- 튜토리얼 창에서 **Change Value** 버튼을 클릭하면, 창에 `mov [esi+18],eax` 명령어가 나타납니다.
- `esi`의 값을 확인(예: `018ECA20`)하고, 오프셋 `0x18`을 기록합니다.

![Step 8 1단계 포인터 분석](assets/img/CheatEngine/Step8/2.png)  
*"Find out what accesses this address"로 1단계 포인터 확인*

> `mov [esi+18],eax`은 `esi+0x18`이 가리키는 주소에 값을 쓰는 명령어입니다.<br>
`esi`가 1단계 포인터이며, 다음 단계에서 이 주소를 추적합니다.
{: .prompt-tip}
---

### 3. 1단계 포인터 주소 검색 및 테이블로 내리기
1단계 포인터 주소(`018ECA20`)를 검색하여 테이블로 내립니다.

- Cheat Engine에서 **Hex** 체크박스를 활성화하고, `esi` 값(`018ECA20`)을 검색합니다.
- **Scan Type(스캔 유형)**을 `Exact Value`로 설정합니다.
- **Value Type(값 유형)**을 `4 Bytes`로 설정합니다.
- 검색 결과에서 주소 `019648E0`을 선택하고, 테이블로 내립니다.

![Step 8 1단계 포인터 검색](assets/img/CheatEngine/Step8/3.png)  
*1단계 포인터 주소 검색 후 테이블로 내리기*

> `018ECA20`을 검색하여 해당 값을 가리키는 주소를 찾고, 테이블로 내려 다음 단계로 진행합니다.
{: .prompt-tip}
---

### 4. 2단계 포인터 추적
1단계 포인터 주소(`019648E0`)를 검색하여 다음 레벨 포인터를 찾습니다.

- 테이블에 추가된 주소 `019648E0`에서 `Find out what accesses this address`를 실행합니다.
- **Change Value** 버튼을 클릭하면, `cmp dword ptr [esi],00` 명령어가 나타납니다.
- `esi`의 값을 확인(예: `019648E0`)하고, 오프셋 `0x0`을 기록합니다.

![Step 8 2단계 포인터 추적](assets/img/CheatEngine/Step8/4.png)  
*2단계 포인터 추적*

> `cmp dword ptr [esi],00`은 `esi`가 가리키는 주소의 값을 비교하는 명령어입니다.<br>
`esi`가 2단계 포인터이며, 다음 단계로 진행합니다.
{: .prompt-tip}
---

### 5. 2단계 포인터 주소 검색 및 테이블로 내리기
2단계 포인터 주소(`019648E0`)를 검색하여 테이블로 내립니다.

- Cheat Engine에서 **Hex** 체크박스를 활성화하고, `esi` 값(`019648E0`)을 검색합니다.
- 검색 결과에서 주소 `01977214`를 선택하고, 테이블로 내립니다.

![Step 8 2단계 포인터 검색](assets/img/CheatEngine/Step8/5.png)  
*2단계 포인터 주소 검색 후 테이블로 내리기*

> `019648E0`을 검색하여 해당 값을 가리키는 주소를 찾고, 테이블로 내려 다음 단계로 진행합니다.
{: .prompt-tip}
---

### 6. 3단계 포인터 추적
2단계 포인터 주소(`01977214`)를 검색하여 다음 레벨 포인터를 찾습니다.

- 테이블에 추가된 주소 `01977214`에서 `Find out what accesses this address`를 실행합니다.
- **Change Value** 버튼을 클릭하면, `cmp dword ptr [esi+14],00` 명령어가 나타납니다.
- `esi`의 값을 확인(예: `01977200`)하고, 오프셋 `0x14`를 기록합니다.

![Step 8 3단계 포인터 추적](assets/img/CheatEngine/Step8/6.png)  
*3단계 포인터 추적*

> `cmp dword ptr [esi+14],00`은 `esi+0x14`가 가리키는 주소의 값을 비교하는 명령어입니다.<br>
`esi`가 3단계 포인터입니다.
{: .prompt-tip}
---

### 7. 3단계 포인터 주소 검색 및 테이블로 내리기
3단계 포인터 주소(`01977200`)를 검색하여 테이블로 내립니다.

- Cheat Engine에서 **Hex** 체크박스를 활성화하고, `esi` 값(`01977200`)을 검색합니다.
- 검색 결과에서 주소 `0190B12C`를 선택하고, 테이블로 내립니다.

![Step 8 3단계 포인터 검색](assets/img/CheatEngine/Step8/7.png)  
*3단계 포인터 주소 검색 후 테이블로 내리기*

> `01977200`을 검색하여 해당 값을 가리키는 주소를 찾고, 테이블로 내려 다음 단계로 진행합니다.
{: .prompt-tip}
---

### 8. 4단계 포인터 추적
3단계 포인터 주소(`0190B12C`)를 검색하여 다음 레벨 포인터를 찾습니다.

- 테이블에 추가된 주소 `0190B12C`에서 `Find out what accesses this address`를 실행합니다.
- **Change Value** 버튼을 클릭하면, `cmp dword ptr [esi+0C],00` 명령어가 나타납니다.
- `esi`의 값을 확인(예: `0190B120`)하고, 오프셋 `0x0C`를 기록합니다.

![Step 8 4단계 포인터 추적](assets/img/CheatEngine/Step8/8.png)  
*4단계 포인터 추적*

> `cmp dword ptr [esi+0C],00`은 `esi+0x0C`가 가리키는 주소의 값을 비교하는 명령어입니다.<br>
`esi`가 4단계 포인터입니다.
{: .prompt-tip}
---

### 9. 베이스 주소 도달 및 테이블로 내리기
4단계 포인터 주소(`0190B120`)를 검색하여 베이스 주소를 찾습니다.

- Cheat Engine에서 **Hex** 체크박스를 활성화하고, `esi` 값(`0190B120`)을 검색합니다.
- 검색 결과에서 정적 주소(예: `"Tutorial-i386.exe"+240690`)를 선택하고, 테이블로 내립니다.

![Step 8 베이스 주소 검색](assets/img/CheatEngine/Step8/9.png)  
*베이스 주소 검색 후 테이블로 내리기*

> 정적 주소에 도달하면 더 이상 포인터를 추적할 필요가 없습니다. 이제 포인터 경로를 구성합니다.
{: .prompt-tip}
---

### 10. 다중 포인터 경로 구성
찾아낸 포인터와 오프셋을 사용하여 다중 포인터 경로를 구성합니다.

- "Add Address Manually"를 클릭하고, **Pointer** 체크박스를 선택합니다.
- 베이스 주소(`"Tutorial-i386.exe"+240690`)와 각 레벨의 오프셋(`0x0C`, `0x14`, `0x0`, `0x18`)을 입력합니다.
- 최종적으로 `P->018ECA38` 형태로 주소가 추가됩니다.

![Step 8 포인터 경로 구성](assets/img/CheatEngine/Step8/10.png)  
*다중 포인터 경로 구성*

> 다중 포인터 경로를 구성하면 값의 위치가 변경되어도 올바른 주소를 추적할 수 있습니다.
{: .prompt-tip}
---

### 11. 값 변경 및 고정
구성한 포인터 경로의 값을 5000으로 변경하고 고정합니다.

- 포인터 경로(`P->018ECA38`)의 값을 `5000`으로 변경합니다.
- **Active**를 체크하여 값을 고정(freeze)합니다.

![Step 8 값 변경 및 고정](assets/img/CheatEngine/Step8/11.png)  
*값을 5000으로 변경하고 고정*

> 값을 5000으로 고정하면 "Change Pointer" 버튼 클릭 후에도 값이 유지됩니다.
{: .prompt-tip}
---

## 결과
포인터 경로를 구성하고 값을 5000으로 고정한 후, **Change Pointer** 버튼을 클릭하면 3초 후 "Next" 버튼이 활성화됩니다.<br>