---
layout: post
title: "[Cheat Engine] Tutorial: Step 6"
date: 2025-04-07 20:06:15 +0900
categories: [Reversing, CheatEngine]
tags: [Reversing, CheatEngine, Tutorial]
comments: true
---

> 이 포스팅에서는 Cheat Engine 튜토리얼의 Step 6를 다룹니다: <br> 해당 튜토리얼은 x32를 기준으로 작성합니다.
>  
> - Step 6 요구사항  
> - Step 6 풀이  
> - 결과  
{: .prompt-info}

## Step 6: 개요 및 요구사항
Cheat Engine 튜토리얼의 Step 6(`000004D18-Tutorial-i386.exe`)를 열면 다음과 같은 창이 나타납니다.

- 창 하단에 특정 값이 표시됩니다.
- 창 하단에 "Change value"와 "Change pointer" 두 개의 버튼이 표시됩니다.
- "Change value"는 값을 변경하고, "Change pointer"는 값과 위치를 모두 변경합니다.
- "Next" 버튼은 아직 비활성화 상태입니다.

튜토리얼 창에 나오는 지시사항을 번역하면 다음과 같습니다:

> 이 단계에서는 값의 주소를 찾는 것만으로는 어렵기 때문에 포인터를 사용합니다.<br>값의 주소를 찾은 후 "Find out what accesses this address"를 사용하세요.  
> 값을 변경하면 목록에 항목이 나타나며, 더블 클릭 시 명령어 상세 창이 열립니다.  
> '[]' 사이에 내용이 있다면 포인터 값을 4바이트 헥사decimal로 스캔해 가장 작은 주소를 선택하세요.  
> "Add Address Manually"에서 포인터를 체크하고 주소, 오프셋(예: [esi+12]라면 12)을 입력하세요.  
> 복잡한 명령어(예: [EAX*2+EDX+310])라면 오프셋(예: 2*4C+310=3A8)을 계산해 입력합니다.  
> 주소가 "P->xxxxxxx"로 추가되면 값을 5000으로 설정, "Active" 체크 후 "Change pointer" 클릭 시 "Next"가 활성화됩니다.

이제 이 요구사항을 하나씩 해결해보겠습니다.

---

## Step 6: 풀이

### 1. 초기 값 검색
현재 튜토리얼에 나타난 값이 100으로 시작하니, 이 값을 Cheat Engine으로 찾아보겠습니다.

- Cheat Engine에서 튜토리얼 프로세스(`000004D18-Tutorial-i386.exe`)를 선택합니다.
- **Scan Type(스캔 유형)**을 `Exact Value`로 설정합니다.
- **Value Type(값 유형)**을 `4 Bytes`로 설정합니다.
- 검색할 값을 `100`으로 입력합니다.
- **First Scan(첫 스캔)** 버튼을 클릭해 메모리에서 값을 검색합니다.

![Step 6 초기 검색](assets/img/CheatEngine/Step6/1.png)  
*초기 값 100 검색*

> 스캔이 완료되면 "Found(발견)" 목록에 여러 주소가 나타납니다. 다음 단계에서 필터링을 진행합니다.
{: .prompt-tip}
---

### 2. Change Value로 값 변경 후 주소 필터링
"Change value" 버튼을 눌러 값을 변경한 후, 변경된 값을 검색하여 주소를 좁힙니다.

- 튜토리얼 창에서 **Change value** 버튼을 클릭합니다. 값이 100에서 920으로 변경됩니다.
- Cheat Engine에서 **Scan Type(스캔 유형)**을 `Exact Value`로 유지합니다.
- 검색할 값을 `920`으로 입력합니다.
- **Next Scan(다음 스캔)** 버튼을 클릭해 변경된 값에 해당하는 주소만 필터링합니다.
- 필터링된 주소 중 `019731C0`을 선택하고, `Add selected addresses to the addresslist`를 통해 테이블로 내립니다.

![Step 6 값 변경 후 검색](assets/img/CheatEngine/Step6/2.png)  
*"Change value" 클릭 후 값 920으로 검색*

> 주소가 하나로 좁혀졌다면, 해당 주소를 테이블로 내려서 다음 단계로 진행합니다.
{: .prompt-tip}
---

### 2-1. "Find out what writes to this address"로 명령어 분석
테이블에 추가한 주소에서 값을 변경하는 코드를 찾아 분석합니다.

- 테이블에 추가된 주소 `019731C0`을 마우스 오른쪽 버튼으로 클릭합니다.
- 메뉴에서 `Find out what writes to this address`를 선택합니다.
- 새 창이 열리며, 처음에는 아무것도 표시되지 않습니다.

![Step 6 코드 분석 창 열기](assets/img/CheatEngine/Step6/2-1.png)  
*"Find out what writes to this address" 선택*

> 이 단계에서는 아직 코드가 나타나지 않으므로, 다음 단계에서 값을 변경하여 코드를 확인합니다.
{: .prompt-tip}
---

### 3. Change Value로 명령어 확인 및 오프셋 확인
값을 변경하여 해당 주소에 쓰기를 하는 코드를 확인하고 오프셋을 확인합니다.

- 튜토리얼 창에서 다시 **Change value** 버튼을 클릭합니다.
- Cheat Engine의 "The following opcodes write to 019731C0" 창에 코드가 나타납니다.
- 나타난 코드 중 `mov [edx],eax`를 확인하며, 오프셋이 0임을 확인합니다.
- 하단의 Advanced Options에서 `edx`의 값을 복사합니다 (예: `019731C0`).

![Step 6 명령어 확인](assets/img/CheatEngine/Step6/3.png)  
*"Change value" 클릭 후 나타난 코드*

> 명령어에 '[]'가 포함되어 있다면 포인터를 사용하는 주소임을 의미합니다.<br>
여기서 오프셋이 0이므로 나중에 입력 시 0을 사용합니다.
{: .prompt-tip}
---

### 4. 포인터 주소 검색 및 테이블 추가
복사한 `edx` 값을 기반으로 포인터 주소를 검색하고 테이블에 추가합니다.

- Cheat Engine에서 **Hex** 체크박스를 활성화하고, 복사한 `edx` 값(`019731C0`)을 검색합니다.
- 검색 결과에서 "Tutorial-i386.exe"로 시작하는 녹색 주소를 선택합니다.
- 선택한 주소를 테이블로 내립니다.

![Step 6 포인터 검색](assets/img/CheatEngine/Step6/4.png)  
*포인터 주소 검색 및 테이블 추가*

> "Tutorial-i386.exe+xxxxx" 형태의 주소는 모듈 기준 상대 주소입니다.<br>
이 주소가 `019731C0`을 가리키는 포인터로 동작하며, 값의 위치가 변경되어도 포인터를 통해 항상 올바른 주소를 참조할 수 있습니다.
{: .prompt-tip}
---

### 5. 포인터 주소와 오프셋 추가
포인터 주소를 설정하고 오프셋을 추가합니다.

- 테이블에서 해당 주소의 값이 `019731C0`임을 확인합니다. 이는 이 주소가 `019731C0`을 가리키는 포인터라는 의미입니다.
- "Add Address Manually"를 클릭하고, **Pointer** 체크박스를 선택합니다.
- 포인터 주소로 "Tutorial-i386.exe" 주소를 입력하고, 오프셋은 0으로 설정합니다.<br>(오프셋이 0임을 확인했으므로).
- 확인 후 추가하면 주소가 `P->019731C0` 형태로 표시됩니다.

![Step 6 포인터 추가](assets/img/CheatEngine/Step6/5.png)  
*포인터 주소와 오프셋 추가*

> 오프셋이 0이므로 별도의 계산 없이 0을 입력하면 됩니다.<br>
포인터를 추가하면 값의 위치가 변경되어도 올바른 주소를 추적할 수 있습니다.
{: .prompt-tip}
---

### 6. 값 설정 및 고정 후 Change Pointer
포인터를 사용하여 값을 설정하고 고정한 뒤, Change Pointer를 실행합니다.

- 추가된 포인터 주소(`P->019731C0`)의 값을 `5000`으로 변경합니다.
- 테이블에서 **Active** 열을 체크하여 값을 고정(freeze)합니다.
- 튜토리얼 창에서 **Change pointer** 버튼을 클릭합니다.

![Step 6 값 설정](assets/img/CheatEngine/Step6/6.png)  
*포인터 값 5000으로 설정 및 고정*

> "Active"를 체크하면 값이 변경되지 않도록 고정됩니다.<br>Change Pointer를 클릭하면 포인터가 새로운 위치를 추적합니다.
{: .prompt-tip}
---

## 결과
포인터 설정 및 값 고정이 완료된 후, 튜토리얼 창에서 **Change pointer** 버튼을 클릭하면 값과 위치가 변경되지만 포인터가 올바르게 추적하여 값을 유지합니다.<br>
정상적으로 완료되었다면 **Next** 버튼이 활성화됩니다.