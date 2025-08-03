---
layout: post
title: "[Cheat Engine] Tutorial: Step 2"
date: 2025-04-06 19:00:00 +0900
categories: [Reversing, CheatEngine]
tags: [Reversing, CheatEngine, Tutorial]
comments: true
---

> 이 포스팅에서는 Cheat Engine 튜토리얼의 Step 2를 다룹니다:  <br> 해당 튜토리얼은 x32를 기준으로 작성합니다.
>  
> - Step 2 요구사항  
> - Step 2 풀이  
> - 결과  
{: .prompt-info}

## Step 2: 개요 및 요구사항

Cheat Engine 튜토리얼의 Step 2(`000004D18-Tutorial-i386.exe`)를 열면 다음과 같은 창이 나타납니다.

- 창 하단에 "Health" 값이 표시됩니다 (초기값: 100).
- "Hit me" 버튼을 누르면 체력이 감소합니다.
- "Next" 버튼은 아직 비활성화 상태입니다.


튜토리얼 창에 나오는 지시사항을 번역하면 다음과 같습니다:  

> 이 창의 맨 아래에 Health: xxx라는 텍스트가 있습니다.  
> 'Hit me'를 클릭할 때마다 체력이 감소합니다.  
> 다음 단계로 넘어가려면 이 값을 찾아 1000으로 변경해야 합니다.

이제 이 요구사항을 하나씩 해결해보겠습니다.

---

## Step 2: 풀이

### 1. 초기 체력 값으로 스캔하기
"Health" 값이 처음에 100으로 시작하니, 이 값을 Cheat Engine으로 찾아보겠습니다.

- Cheat Engine에서 튜토리얼 프로세스(`000004D18-Tutorial-i386.exe`)가 선택한다.
- **Value Type(값 유형)**을 `4 Bytes`로 설정한다.
- "Value(값)" 입력란에 `100`을 입력합니다.
- **New Scan(새 스캔)** 버튼을 클릭해 메모리에서 값이 100인 모든 주소를 검색합니다.

![Step 2 초기 스캔](assets/img/CheatEngine/Step2/2.png)  
*값 100으로 초기 스캔*

> 스캔이 완료되면 Cheat Engine 왼쪽에 "Found(발견)" 목록이 나타납니다. <br>여기에는 값이 100인 주소가 43개 표시됩니다. 주소가 너무 많으니 줄여야 합니다.
{: .prompt-tip}
---

### 2. 주소 목록 좁히기
올바른 주소를 찾기 위해 체력 값을 변경한 후 다시 스캔합니다.

- 튜토리얼 창으로 돌아가서 **Hit me** 버튼을 한 번 누릅니다. 체력이 감소합니다 (예: 100에서 95로).
- Cheat Engine에서 "Value(값)" 입력란에 새로운 체력 값인 `95`를 입력합니다.
- **Next Scan(다음 스캔)** 버튼을 클릭해 값이 95로 변경된 주소만 남기도록 필터링합니다.

![Step 2 다음 스캔](assets/img/CheatEngine/Step2/3.png)  
*"Hit me" 클릭 후 다음 스캔*

> 이제 "Found(발견)" 목록에 주소가 하나만 남습니다. (ex: address : `01B1DC34`, value : `95`) <br>
이 주소가 체력 값을 저장하고 있는 주소일 가능성이 높습니다.
{: .prompt-tip}
---

### 3. 주소를 주소 목록에 추가하기
찾은 주소를 쉽게 수정할 수 있도록 주소 목록에 추가합니다.

- "Found(발견)" 목록에서 주소를 마우스 오른쪽 버튼으로 클릭합니다 (ex: `01B1DC34`)
- **Add selected addresses to the addresslist(선택한 주소를 주소 목록에 추가)**를 선택합니다.

![주소 목록에 추가](assets/img/CheatEngine/Step2/4.png)  
*주소를 주소 목록에 추가*

이제 Cheat Engine 하단에 해당 주소가 추가되고 현재 값(예: 95)이 표시됩니다.

---

### 4. 체력 값 수정하기
튜토리얼에서 요구한 대로 체력 값을 1000으로 변경합니다.

- 주소 목록에서 값을 더블클릭합니다 (예: 95).
- "Change Value(값 변경)" 창이 나타나면 `1000`을 입력하고 **OK(확인)**을 클릭합니다.

![값 변경](assets/img/CheatEngine/Step2/5.png)  
*값을 1000으로 변경*

값을 변경하면 튜토리얼 창이 업데이트되고 "Next" 버튼이 활성화됩니다.

---

## 결과
**Next** 버튼이 활성화 되고 다음 단계 튜토리얼로 이동하시면 됩니다.

