---
layout: post
title: "[Cheat Engine] Tutorial: Step 5"
date: 2025-08-07 18:45:04 +0900
categories: [Reversing, CheatEngine]
tags: [Reversing, CheatEngine, Tutorial]
comments: true
---

> 이 포스팅에서는 Cheat Engine 튜토리얼의 Step 5를 다룹니다: <br> 해당 튜토리얼은 x32를 기준으로 작성합니다.
>  
> - Step 5 요구사항  
> - Step 5 풀이  
> - 결과  
{: .prompt-info}

## Step 5: 개요 및 요구사항
Cheat Engine 튜토리얼의 Step 5(`000004D18-Tutorial-i386.exe`)를 열면 다음과 같은 창이 나타납니다.

- 창 하단에 특정 값이 표시됩니다 (이 값은 튜토리얼을 시작할 때마다 위치가 변경됨).
- "Change value" 버튼을 누르면 값이 변경됩니다.
- "Next" 버튼은 아직 비활성화 상태입니다.

튜토리얼 창에 나오는 지시사항을 번역하면 다음과 같습니다:

> 여기 아래에 있는 값은 튜토리얼을 시작할 때마다 다른 위치에 있게 됩니다.<br>따라서 주소 목록에 일반적인 항목을 추가하는 방식은 작동하지 않습니다.  
> 주소를 찾은 후, Cheat Engine에서 해당 주소를 오른쪽 클릭하고 `"Find out what writes to this address"`를 사용하세요.  
> "Change value" 버튼을 클릭하면 코드가 나타나고, 이를 아무것도 하지 않는 코드로 교체해야 합니다.  
> 모든 것이 제대로 되면 "Change value"를 다시 클릭했을 때 "Next" 버튼이 활성화됩니다.

이제 이 요구사항을 하나씩 해결해보겠습니다.

---

## Step 5: 풀이

### 1. 초기 값 검색
현재 튜토리얼에 나타난 값이 100으로 시작하니, 이 값을 Cheat Engine으로 찾아보겠습니다.

- Cheat Engine에서 튜토리얼 프로세스(`000004D18-Tutorial-i386.exe`)를 선택합니다.
- **Scan Type(스캔 유형)**을 `Exact Value`로 설정합니다.
- **Value Type(값 유형)**을 `4 Bytes`로 설정합니다.
- 검색할 값을 `100`으로 입력합니다.
- **First Scan(첫 스캔)** 버튼을 클릭해 메모리에서 값을 검색합니다.

![Step 5 초기 검색](assets/img/CheatEngine/Step5/1.png)  
*초기 값 100 검색*

> 스캔이 완료되면 "Found(발견)" 목록에 여러 주소가 나타납니다. <br> 주소가 많으니 다음 단계에서 필터링을 진행합니다.
{: .prompt-tip}
---

### 2. Change Value로 값 변경 후 주소 필터링
"Change value" 버튼을 눌러 값을 변경한 후, 변경된 값을 검색하여 주소를 좁힙니다.

- 튜토리얼 창에서 **Change value** 버튼을 클릭합니다. 값이 100에서 155로 변경됩니다.
- Cheat Engine에서 **Scan Type(스캔 유형)**을 `Exact Value`로 유지합니다.
- 검색할 값을 `155`로 입력합니다.
- **Next Scan(다음 스캔)** 버튼을 클릭해 변경된 값에 해당하는 주소만 필터링합니다.
- 필터링된 주소 중 `01742130`을 선택하고, `Add selected addresses to the addresslist`를 통해 테이블로 내립니다.

![Step 5 값 변경 후 검색](assets/img/CheatEngine/Step5/2.png)  
*"Change value" 클릭 후 값 155로 검색*

> 주소가 하나로 좁혀졌다면, 해당 주소를 테이블로 내려서 다음 단계로 진행합니다.
{: .prompt-tip}
---

### 3. "Find out what writes to this address"로 코드 분석
테이블에 추가한 주소에서 값을 변경하는 코드를 찾아 분석합니다.

- 테이블에 추가된 주소 `01742130`을 마우스 오른쪽 버튼으로 클릭합니다.
- 메뉴에서 `Find out what writes to this address`를 선택합니다.
- 새 창이 열리며, 처음에는 아무것도 표시되지 않습니다.

![Step 5 코드 분석 창 열기](assets/img/CheatEngine/Step5/3.png)  
*"Find out what writes to this address" 선택*

---

### 4. Change Value로 코드 확인
값을 변경하여 해당 주소에 쓰기를 하는 코드를 확인합니다.

- 튜토리얼 창에서 다시 **Change value** 버튼을 클릭합니다.
- Cheat Engine의 "The following opcodes write to 01742130" 창에 코드가 나타납니다.
- 나타난 코드 중 `00427D92 - 89 10 - mov [eax],edx`를 확인합니다.

![Step 5 코드 확인](assets/img/CheatEngine/Step5/4.png)  
*"Change value" 클릭 후 나타난 코드*

> 코드가 나타났다면, 해당 코드가 값을 변경하는 명령어라는 것을 알 수 있습니다.
{: .prompt-tip}
---

### 5. Replace로 코드 NOP 처리
찾아낸 코드를 NOP(No Operation)으로 교체하여 값 변경을 방지합니다.

- 코드 `00427D92 - 89 10 - mov [eax],edx`를 선택하고 **Replace** 버튼을 클릭합니다.
- 코드를 NOP으로 교체하면 해당 명령어가 더 이상 값을 변경하지 않게 됩니다.
- 이 과정에서 코드가 `Advanced Options` 창의 코드 목록에 추가됩니다.

![Step 5 NOP 처리](assets/img/CheatEngine/Step5/5.png)  
*코드를 NOP으로 교체*

> NOP 처리를 하면 값이 더 이상 변경되지 않으며, 테이블에 저장된 코드 목록은 나중에 재사용할 수 있습니다.
{: .prompt-tip}
---

## 결과
NOP 처리가 완료된 후, 튜토리얼 창에서 **Change value** 버튼을 다시 클릭하면 값이 변경되지 않습니다.<br>
정상적으로 완료하였다면 **Next** 버튼이 활성화됩니다.