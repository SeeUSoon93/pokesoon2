# 포켓몬고 보조 웹앱 프로젝트 구조 명세

## 1. 프로젝트 개요

이 프로젝트는 소규모 지인용으로 사용하는 비공식 포켓몬고 보조 웹앱이다.

목표는 기능을 크게 벌리지 않고, 아래 4가지 핵심 메뉴만 갖춘 모바일 친화형 웹앱의 기본 구조를 먼저 만드는 것이다.

- 이벤트
- 바이옴 지도
- 홈
- IV 계산기
- 로그인 / 마이

IV 계산기는 하단 메뉴에 포함되는 핵심 화면이다.

초기 단계에서는 **디자인 완성보다 구조 정리와 화면/라우팅 뼈대 구성**을 우선한다.

---

## 2. 기술 스택

- Framework: Next.js (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Backend: Next.js Route Handlers
- Database: MongoDB
- Map: MapLibre GL JS
- Auth: Firebase Authentication

이번 단계에서는 백엔드를 별도 FastAPI로 분리하지 않고, **Next.js 내부 router 기반 API 구조**로 설계한다.

---

## 3. MVP 목표

이번 작업에서는 실제 기능 완성보다 아래를 먼저 만드는 것이 목표다.

1. 프로젝트 폴더 구조 생성
2. App Router 기준 페이지 구조 생성
3. 공통 레이아웃 생성
4. 모바일 앱 느낌의 하단 네비게이션 구조 생성
5. 각 화면의 기본 뼈대 컴포넌트 생성
6. API route 기본 폴더 구조 생성
7. MongoDB 연결용 기본 유틸 파일 생성
8. 추후 확장 가능한 컴포넌트/도메인 분리 구조 마련

---

## 4. 핵심 기능 범위

### 4.1 이벤트

- 이벤트 목록 조회
- 캘린더 또는 리스트 UI 뼈대
- 이벤트 상세 화면 진입 구조

### 4.2 바이옴 지도

- 지도 화면
- 지도 클릭 시 지역 상세 바텀시트 또는 패널
- 예상 포켓몬 리스트 표시 영역
- 후기 목록 표시 영역
- Firebase 로그인 사용자만 후기 작성 가능

### 4.3 홈

- 카드 기반 대시보드
- 최근 이벤트 요약
- 지도 바로가기
- IV 계산기 바로가기
- 최근 후기 또는 안내 카드

### 4.4 IV 계산기

- 별도 페이지 제공
- 입력 필드와 결과 카드 구조만 우선 생성

### 4.5 로그인 / 마이

- 로그인 화면
- 로그인 상태 확인
- 로그인 사용자 정보 표시
- 내가 작성한 후기 목록을 나중에 확장 가능하도록 구조만 준비

---

## 5. 권한 정책

- 비로그인 사용자
  - 이벤트 조회 가능
  - 바이옴 지도 조회 가능
  - 예상 포켓몬 조회 가능
  - 후기 읽기 가능
  - IV 계산기 사용 가능
  - 후기 작성 불가

- 로그인 사용자
  - 위 기능 전부 가능
  - 후기 작성 가능

초기 MVP에서는 관리자 페이지는 만들지 않는다.

---

## 6. 라우팅 구조

다음과 같은 App Router 구조를 기준으로 한다.

- `/` : 홈
- `/events` : 이벤트 목록
- `/events/[id]` : 이벤트 상세
- `/map` : 바이옴 지도
- `/iv` : IV 계산기
- `/login` : 로그인
- `/me` : 마이페이지

API Route 예시:

- `/api/events`
- `/api/events/[id]`
- `/api/biomes`
- `/api/biomes/[id]`
- `/api/reports`
- `/api/reports/[id]`
- `/api/iv`

---

## 7. 화면 UX 방향

### 공통 원칙

- 모바일 우선
- 전통적인 게시판형 UI보다 앱 같은 구조
- 카드 기반 대시보드
- 큰 화면에서는 카드 그리드 확장
- 하단 네비게이션 중심 구조

### 하단 네비게이션

기본 메뉴는 5개로 구성한다.

- 이벤트
- 바이옴 지도
- 홈
- 로그인 또는 마이

로그인 여부에 따라 마지막 탭의 라벨과 화면 진입 경로가 달라질 수 있다.

예:

- 비로그인: 로그인
- 로그인: 마이

### 지도 화면 UX

- 지도 전체를 메인으로 사용
- 특정 지역 클릭 시 바텀시트 또는 우측 패널 오픈
- 패널 내에 아래 정보를 표시
  - 추정 바이옴
  - 예상 포켓몬 리스트
  - 실제 후기 목록
  - 후기 작성 버튼

---

## 8. 데이터 모델 초안

MongoDB 컬렉션 초안은 아래와 같다.

### users

- `_id`
- `firebaseUid`
- `email`
- `name`
- `image`
- `provider`
- `createdAt`
- `updatedAt`

### events

- `_id`
- `title`
- `slug`
- `description`
- `startAt`
- `endAt`
- `tags`
- `createdAt`
- `updatedAt`

### biome_regions

- `_id`
- `name`
- `center`
- `geometry`
- `biomeType`
- `predictedPokemon`
- `confidence`
- `createdAt`
- `updatedAt`

### biome_reports

- `_id`
- `regionId`
- `userId`
- `visitedAt`
- `observedPokemon`
- `note`
- `rating`
- `createdAt`
- `updatedAt`

### iv_calculations

초기에는 DB 저장 없이 클라이언트 계산만 우선 고려한다.
필요 시 추후 저장 기능 추가.

---

## 9. 디렉토리 구조 요구사항

Codex는 아래와 같은 구조를 먼저 생성해야 한다.

```txt
src/
  app/
    layout.tsx
    page.tsx
    globals.css

    events/
      page.tsx
      [id]/
        page.tsx

    map/
      page.tsx

    iv/
      page.tsx

    login/
      page.tsx

    me/
      page.tsx

    api/
      events/
        route.ts
      events/[id]/
        route.ts
      biomes/
        route.ts
      biomes/[id]/
        route.ts
      reports/
        route.ts
      reports/[id]/
        route.ts
      iv/
        route.ts

  components/
    layout/
      app-shell.tsx
      bottom-nav.tsx
      header.tsx

    home/
      dashboard.tsx
      dashboard-card.tsx
      quick-links.tsx

    events/
      event-list.tsx
      event-card.tsx
      event-calendar.tsx

    map/
      biome-map.tsx
      biome-bottom-sheet.tsx
      biome-region-card.tsx
      report-list.tsx
      report-form.tsx

    iv/
      iv-calculator-form.tsx
      iv-result-card.tsx

    auth/
      login-form.tsx
      auth-guard.tsx

    common/
      card.tsx
      button.tsx
      empty-state.tsx
      section-title.tsx

  lib/
    mongodb.ts
    utils.ts
    constants.ts
    auth.ts
    firebase/
      client.ts
      admin.ts
      config.ts

  types/
    event.ts
    biome.ts
    report.ts
    user.ts
    iv.ts

  features/
    events/
      queries.ts
      mapper.ts

    biomes/
      queries.ts
      mapper.ts

    reports/
      queries.ts
      mapper.ts

    iv/
      calculator.ts

  hooks/
    use-auth.ts
    use-bottom-nav.ts
    use-map-panel.ts

  providers/
    auth-provider.tsx
```

---

## 10. 구현 원칙

- 실제 비즈니스 로직보다 구조를 먼저 만든다.
- 더미 데이터로도 화면이 보이게 한다.
- 각 페이지는 최소한의 제목, 설명, placeholder UI를 포함한다.
- 공통 컴포넌트는 재사용 가능한 단위로 만든다.
- 타입 정의를 먼저 분리한다.
- API route는 실제 DB 연결이 없더라도 기본 응답 구조를 갖춘다.
- 후기 작성은 로그인 체크가 들어갈 수 있도록 컴포넌트 구조를 분리한다.

---

## 11. 이번 단계에서 하지 않을 것

이번 프로젝트 구조 생성 단계에서는 아래 항목은 구현하지 않는다.

- 자유게시판
- 광고 시스템
- 관리자 페이지
- 실시간 알림
- 복잡한 권한 관리
- 이미지 업로드
- 정교한 지도 데이터 수집 파이프라인
- 완전한 인증 시스템 구현
- 단, Firebase Authentication 연동을 위한 구조와 기본 설정 파일은 포함한다.
- 실제 포켓몬고 공식 데이터 연동

---

## 12. Codex 작업 지시

Codex는 아래 작업만 우선 수행한다.

1. Next.js App Router 프로젝트 기준으로 폴더 구조를 생성한다.
2. 위 명세에 맞는 기본 파일을 만든다.
3. 각 페이지에 최소 동작 가능한 placeholder 화면을 만든다.
4. 하단 네비게이션이 포함된 공통 레이아웃을 만든다.
5. MongoDB 연결용 `lib/mongodb.ts` 파일을 만든다.
6. Firebase Authentication 연동을 위한 기본 설정 파일과 인증 상태 관리 구조를 만든다.
7. 타입 파일과 더미 데이터용 기본 타입 구조를 만든다.
8. API Route 파일은 더미 JSON을 반환하도록 만든다.
9. 지도/이벤트/IV/로그인 화면은 일단 skeleton 수준으로만 만든다.
10. 코드 스타일은 유지보수하기 쉽게 모듈 단위로 분리한다.
11. 우선 목표는 기능 완성이 아니라 **확장 가능한 프로젝트 구조 초기화**다.

---

## 13. 기대 결과

이 단계가 끝나면 아래 상태여야 한다.

- 프로젝트를 실행하면 기본 라우팅이 동작한다.
- 홈 / 이벤트 / 지도 / IV / 로그인(또는 마이) 화면 이동이 된다.
- 하단 네비게이션이 보인다.
- 각 페이지에 임시 카드/섹션 UI가 보인다.
- API route가 기본 JSON 응답을 반환한다.
- 이후 실제 기능 구현을 바로 이어서 붙일 수 있는 구조가 준비된다.
