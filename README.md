# 코딩 에이전트를 똑똑하게 사용하기 with MCP 서버

## 🎯 세션 목표

MCP(Model Context Protocol)를 활용하여 **문서 학습 → 계획 수립 → Issue 생성 → 코드 리팩토링 → 검증 → PR 생성**에 이르는 전체 워크플로를 자동화합니다.

## 📚 사용할 MCP 서버

1. **Context7**: 최신 라이브러리 문서를 실시간으로 학습
2. **GitHub**: 이슈/PR 생성 및 관리 자동화

## 🚀 시작하기

### 1. Gemini CLI 모델 설정

Gemini CLI에서 `/model` 명령어를 입력하여 사용 가능한 모델 목록을 확인합니다.
목록에서 **Pro** 모델을 선택하여 더 나은 성능을 활용하세요.

```bash
# Gemini CLI에서 실행
> /model
# 표시되는 목록에서 Pro 모델 선택
│ Select Model                                                                                                 │
│                                                                                                              │
│   1. Auto (recommended)                                                                                      │
│      Let the system choose the best model for your task                                                      │
│ ● 2. Pro                                                                                                     │
│      For complex tasks that require deep reasoning and creativity                                            │
│   3. Flash                                                                                                   │
│      For tasks that need a balance of speed and reasoning                                                    │
│   4. Flash-Lite                                                                                              │
│      For simple tasks that need to be done quickly                                                           │
│ > To use a specific Gemini model on startup, use the --model flag.
```

### 2. MCP 서버 설정

#### 2.1 기본 설정 확인

프로젝트의 `/.gemini` 폴더에 기본적인 Gemini CLI MCP 명세가 이미 구성되어 있습니다.

#### 2.2 MCP 서버 설치

터미널에서 다음 명령어를 실행하여 필요한 MCP 서버를 설치합니다:

```bash
# GitHub MCP 서버 설치
gemini extensions install https://github.com/github/github-mcp-server

# Context7 MCP 서버 설치
gemini extensions install https://github.com/upstash/context7
```

#### 2.3 환경 변수 설정

`/.gemini` 폴더 안에 `.env` 파일을 생성하고 필요한 API 키를 추가합니다:

##### GitHub Personal Access Token (PAT) 발급

1. [GitHub PAT 생성 페이지](https://github.com/settings/personal-access-tokens/new)에 접속
2. 다음 권한 설정:
   - **Repository Access**: All repositories 선택
   - **Permissions**: Issues, Pull Requests 선택
3. 토큰 생성 후 `/.gemini/.env` 파일에 추가:

```bash
GITHUB_MCP_PAT=your_github_pat_here
```

##### 최종 .env 파일 예시

```bash
# /.gemini/.env
GITHUB_MCP_PAT=your_github_pat_here
```

### 3. 의존성 설치

```bash
yarn install
```

### 4. 개발 서버 실행

```bash
yarn start
```

### 5. MCP 서버 연결 확인

Gemini CLI를 실행하고 `/mcp` 명령어를 입력하여 MCP 서버 연결 상태를 확인하세요.

다음 2개의 MCP 서버가 모두 표시되면 설정이 완료된 것입니다:

- **context7** - 최신 라이브러리 문서 학습
- **github** - GitHub 이슈/PR 관리

![MCP 서버 연결 확인](./public/mcp.png)

## 📁 프로젝트 구조

```
client/
├── src/
│   ├── before/                  # 리팩토링 전 코드 (React 18 패턴)
│   │   ├── ProfileForm.jsx      # 폼 제출 처리 (useState 4개 사용)
│   │   └── TextGenerator.jsx    # AI 텍스트 생성 (수동 상태 관리)
│   ├── after/                   # 리팩토링 후 코드 (React 19 패턴)
│   │   └── (실습 중 생성됨)
│   ├── api.js                   # Mock API 함수
│   ├── ErrorBoundary.jsx        # 에러 처리용 컴포넌트
│   ├── App.jsx                  # 메인 앱 컴포넌트
│   ├── main.jsx                 # 진입점
│   └── index.css                # 스타일
└── README.md                    # 리드미 파일
```

## 🍀 기초 실습: Context7로 문서 학습하기

### 목표

Context7 MCP를 사용하여 최신 라이브러리 문서를 학습하고 코드에 반영합니다.

### 프롬프트

```
context7을 통해 불러온 '/googleapis/js-genai' 라이브러리 문서를 참고하여 TextGenerator.jsx 코드 수정을 수행해줘.

```

### 결과

- Context7이 google/genai 최신 문서를 가져옴
- Gemini가 문서 기반으로 코드를 업데이트

---

## 🧨 심화 실습: MCP 통합 워크플로

현재 `src/before/ProfileForm.jsx`를 React 19의 최신 문법으로 리팩토링하는 전체 워크플로를 진행합니다.

### Phase 1: React 19 문서 학습

**프롬프트:**

```
context7을 이용해서 React 19 문서를 학습해줘.
```

**결과:** Copilot이 React 19 최신 지식을 습득합니다.

---

### Phase 2: 계획 수립 및 이슈 생성

**프롬프트:**

```
현재 작업 중인 내용을 최신 react 문법을 이용해 ProfileForm.jsx 파일을 리팩토링할 계획을 세우고
GitHub MCP를 이용하여 현재 레포지토리와 연결된 원격 저장소에 새로운 이슈로 만들어 줘.
```

**결과:**

- Copilot이 현재 파일 분석 후 리팩토링 계획 수립
- GitHub MCP가 자동으로 이슈 생성 (예: Issue #1)

---

### Phase 3: 코드 리팩토링

**프롬프트:**

```
ProfileForm을 최신 리액트 문법을 이용하여 계획한 리팩토링 진행해줘
그리고 완성된 파일을 App.jsx에 추가해줘
```

**리팩토링 체크리스트:**

- ✅ 최신 react 문법으로 상태 관리 통합
- ✅ 동일한 UI/UX 동작 보장

**결과:**

- Copilot이 계획에 따라 코드를 리팩토링
- `src/after/ProfileForm.jsx` 파일 생성
- App.jsx에 리팩토링된 파일 추가

---

### Phase 4: PR 생성

**프롬프트:**

```
새로운 브랜치를 만든뒤 변경 사항을 커밋하고, 아까 만든 이슈와 연결해서 원격 저장소(origin)에 PR까지 올려 줘.
```

**결과:**

- GitHub MCP가 커밋 메시지 자동 생성
- 이슈와 연결된 PR 자동 생성

---

## 💡 핵심 포인트

- **Context7**: 최신 문서를 실시간으로 학습하여 AI에게 정확한 컨텍스트 제공
- **GitHub MCP**: 이슈/PR 관리 자동화로 워크플로 간소화

### 추가 활용 예시

#### 1. 최신 라이브러리 문서 학습

Context7을 활용하여 최신 라이브러리의 API와 베스트 프랙티스를 학습할 수 있습니다.

**프롬프트 예시:**

```
context7을 이용해서 Tanstack Query v5 문서를 학습하고,
현재 프로젝트의 데이터 페칭 로직을 최신 패턴으로 리팩토링해줘.
```

#### 2. 에러 디버깅

특정 라이브러리의 최신 문서를 참조하여 에러를 해결할 수 있습니다.

**프롬프트 예시:**

```
context7을 이용해서 React 19 문서를 참고해.
useFormStatus를 사용했는데 'pending' 상태가 업데이트되지 않는 이유를
분석하고 해결 방법을 제시해줘.
```

#### 3. 최신 기능 탐색

새로 릴리스된 기능에 대해 학습하고 활용 방법을 파악할 수 있습니다.

**프롬프트 예시:**

```
context7을 이용해서 react19의 새로운 기능들을 학습하고,
현재 프로젝트에 적용 가능한 기능과 그 이점을 설명해줘.
```

## 💡 핵심 메시지

### MCP로 해결하는 "지식의 격차"

#### 문제점: 기존 AI의 한계

- **고정된 지식**: 학습 데이터의 특정 시점에 갇혀 있음
- **최신 정보 부족**: 새로운 라이브러리 버전, API 변경사항을 모름
- **수동 업데이트**: 개발자가 직접 최신 문서를 찾아 제공해야 함

#### 해결책: MCP를 통한 실시간 컨텍스트 연결

- **Context7**: 최신 라이브러리 문서를 실시간으로 학습
- **GitHub**: 코드 변경 이력과 이슈를 자동으로 추적

#### 결과: 진정한 AI 페어 프로그래밍

MCP는 단순한 도구가 아닌, **AI에게 실시간 지식을 제공하는 파이프라인**입니다.  
이를 통해 AI는 최신 베스트 프랙티스를 적용하고, 신뢰할 수 있는 코드를 생성할 수 있습니다.

---

### 참고

- context7을 gemini-cli에 연결하는 법: https://github.com/upstash/context7
- Gihub MCP를 gemini-cli에 연결하는 법: https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-gemini-cli.md
