---
layout: post
title: "[Cheat Engine] Tutorial: Step 7"
date: 2025-08-08 18:45:00 +0900
categories: [Reversing, CheatEngine]
tags: [Reversing, CheatEngine, Tutorial]
comments: true
---

> 이 포스팅에서는 Cheat Engine 튜토리얼의 Step 7를 다룹니다: <br> 해당 튜토리얼은 x32를 기준으로 작성합니다.
>  
> - Step 7 요구사항  
> - Step 7 풀이  
> - 결과  
{: .prompt-info}

## Step 7: 개요 및 요구사항
Cheat Engine 튜토리얼의 Step 7(`000004D18-Tutorial-i386.exe`)를 열면 다음과 같은 창이 나타납니다.

- 창 하단에 건강 값이 표시됩니다.
- "Hit me" 버튼을 클릭할 때마다 체력력이 1씩 감소합니다.
- "Next" 버튼은 아직 비활성화 상태입니다.

튜토리얼 창에 나오는 지시사항을 번역하면 다음과 같습니다:

> 이 단계에서는 코드 주입을 사용하여 "Hit me" 버튼 클릭 시 건강 값이 1 감소하는 대신 2 증가하도록 변경해야 합니다.<br>먼저 건강 값의 주소를 찾고, 해당 주소에 쓰는 코드를 분석하세요.  
> 디스어셈블러에서 해당 코드를 확인한 후, 자동 어셈블러(Ctrl+A)를 열고 코드 주입 템플릿을 선택해 주입 프레임워크를 생성합니다.  
> 건강을 감소시키는 코드를 증가시키는 코드(예: ADD 명령어)로 변경하고, 원래 감소 코드는 삭제하세요.  
> 모든 것이 제대로 되면 "Hit me" 버튼 클릭 시 건강이 2씩 증가하고 "Next" 버튼이 활성화됩니다.

이제 이 요구사항을 하나씩 해결해보겠습니다.

---

## Step 7: 풀이

### 1. 초기 값 검색
현재 튜토리얼에 나타난 체력 값이 100으로 시작하니, 이 값을 Cheat Engine으로 찾아보겠습니다.

- Cheat Engine에서 튜토리얼 프로세스(`000004D18-Tutorial-i386.exe`)를 선택합니다.
- **Scan Type(스캔 유형)**을 `Exact Value`로 설정합니다.
- **Value Type(값 유형)**을 `4 Bytes`로 설정합니다.
- 검색할 값을 `100`으로 입력합니다.
- **First Scan(첫 스캔)** 버튼을 클릭해 메모리에서 값을 검색합니다.

![Step 7 초기 검색](assets/img/CheatEngine/Step7/1.png)  
*초기 값 100 검색*

> 스캔이 완료되면 "Found(발견)" 목록에 여러 주소가 나타납니다. 다음 단계에서 필터링을 진행합니다.
{: .prompt-tip}
---

### 2. Hit Me로 값 변경 후 주소 필터링
"Hit me" 버튼을 눌러 값을 변경한 후, 변경된 값을 검색하여 주소를 좁힙니다.

- 튜토리얼 창에서 **Hit me** 버튼을 클릭합니다. 값이 100에서 99로 감소합니다.
- Cheat Engine에서 **Scan Type(스캔 유형)**을 `Exact Value`로 유지합니다.
- 검색할 값을 `99`로 입력합니다.
- **Next Scan(다음 스캔)** 버튼을 클릭해 변경된 값에 해당하는 주소만 필터링합니다.
- 필터링된 주소 중 `0184A930`을 선택하고, `Add selected addresses to the addresslist`를 통해 테이블로 내립니다.

![Step 7 값 변경 후 검색](assets/img/CheatEngine/Step7/2.png)  
*"Hit me" 클릭 후 값 99로 검색*

> 주소가 하나로 좁혀졌다면, 해당 주소를 테이블로 내려서 다음 단계로 진행합니다.
{: .prompt-tip}
---

### 3. "Find out what writes to this address"로 명령어 분석
테이블에 추가한 주소에서 값을 변경하는 코드를 찾아 분석합니다.

- 테이블에 추가된 주소 `0184A930`을 마우스 오른쪽 버튼으로 클릭합니다.
- 메뉴에서 `Find out what writes to this address`를 선택합니다.
- 새 창이 열리며, 처음에는 아무것도 표시되지 않습니다.
- 튜토리얼 창에서 **Hit me** 버튼을 클릭하면, 창에 `sub dword ptr [ebx+000004A8],01` 명령어가 나타납니다.<br>
이는 건강 값을 1 감소시키는 코드입니다.

![Step 7 명령어 분석](assets/img/CheatEngine/Step7/3.png)  
*"Find out what writes to this address"로 명령어 확인*

> `sub dword ptr [ebx+000004A8],01`은 `ebx+0x4A8`이 가리키는 주소의 값을 1 감소시키는 명령어입니다. 이 코드를 증가시키는 코드로 변경할 예정입니다.
{: .prompt-tip}
---

### 4. Show Disassembler로 메모리 뷰 확인
명령어가 있는 주소를 디스어셈블러로 확인합니다.

- "The following opcodes write to 0184A930" 창에서 **Show disassembler** 버튼을 클릭합니다.
- 메모리 뷰 창이 열리며, `sub dword ptr [ebx+000004A8],01` 명령어가 있는 주소(`Tutorial-i386.exe+28A78`)를 확인할 수 있습니다.

![Step 7 메모리 뷰](assets/img/CheatEngine/Step7/4.png)  
*Show Disassembler로 메모리 뷰 확인*

> 메모리 뷰에서 해당 명령어의 주소를 확인한 후, 다음 단계에서 자동 어셈블러를 사용하여 코드를 수정합니다.
{: .prompt-tip}
---

### 5. 자동 어셈블러로 코드 주입 준비 (Code Injection 템플릿 선택)
찾아낸 코드를 수정하기 위해 자동 어셈블러를 사용하여 코드 주입을 준비합니다.

- 메모리 뷰 창에서 `sub dword ptr [ebx+000004A8],01` 명령어가 있는 주소(예: `Tutorial-i386.exe+28A78`)를 선택합니다.
- **Ctrl+A**를 눌러 자동 어셈블러 창을 엽니다.
- 자동 어셈블러 창에서 **Template** 메뉴를 클릭하고 **Code Injection**을 선택하기 직전 상태를 확인합니다.

![Step 7 코드 주입 준비](assets/img/CheatEngine/Step7/5.png)  
*Code Injection 템플릿 선택 직전*

> **Template** 메뉴에서 **Code Injection**을 선택하면 코드 주입을 위한 기본 템플릿이 생성됩니다.
{: .prompt-tip}
---

### 6. Code Injection 템플릿 생성
Code Injection 템플릿을 선택하여 기본 프레임워크를 생성합니다.

- **Template > Code Injection**을 선택합니다.
- 코드 주입 템플릿이 생성되며, `alloc`, `newmem`, `originalcode` 섹션이 포함됩니다.
- `originalcode` 섹션에는 원래 코드인 `sub dword ptr [ebx+000004A8],01`이 포함되어 있습니다.

![Step 7 템플릿 생성](assets/img/CheatEngine/Step7/6.png)  
*Code Injection 기본 템플릿*

> `alloc`은 새로운 메모리 블록을 할당하여 코드 케이브를 생성합니다.<br>
코드 케이브란 프로그램의 메모리에서 사용되지 않는 빈 공간을 의미합니다.<br>
과거에는 실행 파일 내 빈 영역을 찾아 사용했으나, 윈도우 2000 이후로는 `alloc`을 통해 동적으로 메모리를 할당하는 방식이 일반적입니다.<br>
이 메모리 블록에 새로운 코드를 삽입하고 원래 코드의 실행 흐름을 리다이렉트하여 코드 주입을 수행합니다.
{: .prompt-tip}
---

### 7. 코드 수정 및 주입
자동 어셈블러에서 코드를 수정하여 건강 값을 감소시키는 대신 증가시키도록 변경합니다.

- `originalcode` 섹션에 있는 `sub dword ptr [ebx+000004A8],01` 명령어를 주석 처리(앞에 `//` 추가)하여 비활성화합니다.
- `newmem` 섹션에 체력 값을 2 증가시키는 코드를 추가합니다.
- `add dword ptr [ebx+000004A8],02`
- 코드를 적용하기 위해 **Execute** 버튼을 클릭하기 직전 상태를 확인합니다.

![Step 7 코드 수정](assets/img/CheatEngine/Step7/7.png)  
*원래 코드 주석 처리 후 증가 코드 추가*

> 원래 코드를 주석 처리하지 않으면 감소와 증가가 동시에 적용되어 혼란스러울 수 있으므로,<br>
`sub dword ptr [ebx+000004A8],01`을 비활성화하는 것이 좋습니다.
{: .prompt-tip}
---

### 8. 코드 주입 후 메모리 뷰 확인
코드 주입이 완료된 후, 메모리 뷰에서 변경된 코드를 확인합니다.

- **Execute** 버튼을 클릭하여 코드를 주입합니다.
- 메모리 뷰 창으로 돌아가면, 원래 주소(`Tutorial-i386.exe+28A78`)에서 `jmp newmem` 명령어로 변경된 것을 확인할 수 있습니다.
- 이는 코드가 새로운 메모리 블록으로 리다이렉트되어 실행됨을 의미합니다.

![Step 7 메모리 뷰 변경](assets/img/CheatEngine/Step7/8.png)  
*코드 주입 후 변경된 메모리 뷰*

> `jmp newmem` 명령어는 원래 코드 대신 새로운 메모리 블록에서 실행되도록 흐름을 변경합니다. 이제 "Hit me" 버튼을 클릭하면 건강 값이 2씩 증가합니다.
{: .prompt-tip}
---

## 결과
코드 주입이 완료된 후, 튜토리얼 창에서 **Hit me** 버튼을 클릭하면 체력 값이 1 감소하는 대신 2씩 증가합니다.<br>
정상적으로 완료되었다면 **Next** 버튼이 활성화됩니다.
