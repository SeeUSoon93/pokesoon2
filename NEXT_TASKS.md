# Next Tasks

## Current State

- Firebase Auth는 `AuthProvider`에 실제 연결되어 있다.
- 로그인 시 `POST /api/users/me`로 `users/{uid}` 문서를 sync한다.
- `GET /api/users/me`로 현재 사용자 문서를 읽을 수 있다.
- `GET/POST/PATCH/DELETE /api/reports` 흐름이 있고, create/update/delete는 권한 검사가 있다.
- 지도 화면은 `map-workspace.tsx` 기준으로 지역 선택, 후기 필터링, 후기 작성이 연결되어 있다.
- 후기 목록은 작성자 본인 또는 관리자가 즉시 수정/삭제할 수 있고, map/me 화면 state에 바로 반영된다.
- IV 계산기는 `iv-workspace.tsx`와 `/api/iv`가 연결되어 있다.
- 보드 레이아웃은 페이지별 `localStorage`에 저장되고, 초기화 버튼이 있다.
- `scripts/seed-firestore.mjs`로 Firestore seed를 넣을 수 있다.
- 이벤트 화면은 `events-workspace.tsx`에서 상태/태그 필터와 브리핑 패널을 제공한다.
- 사용자 요청 때문에 아직 build, typecheck, dev 실행 검증은 하지 않았다.

## Highest Priority

1. MapLibre GL JS 실제 지도 붙이기
- 현재 지도는 `src/components/map/biome-map.tsx`의 프리뷰 UI다.
- 다음 단계는 `maplibre-gl` 설치, 실제 canvas 교체, `biome_regions.geometry` 표시다.

2. IV 계산 로직 정밀화
- 현재 `features/iv/calculator.ts`는 placeholder 계산식이다.
- 실제 공식/근사식 기준으로 로직을 교체해야 한다.

3. 이벤트 관리자 UX 마감
- 이벤트 목록/상세는 이미 고도화했지만, 관리자 create/update/delete는 아직 `window.location.reload()`에 의존한다.
- `AdminActions`를 callback 기반으로 바꾸거나 events client state를 두는 식으로 정리할 수 있다.

4. 후기 UX 마감
- 현재는 JSON prompt 기반 수정 UI다.
- 나중에는 폼 또는 모달 기반 편집으로 바꾸면 사용감이 훨씬 좋아진다.

5. 보드 UX 마감
- 지금은 `localStorage` 저장, 초기화, 단순 충돌 방지만 있다.
- 드래그 감도, row 높이, 모바일 간격은 실제 사용감 기준으로 추가 조정 가능하다.

## Useful Commands

- `npm run seed:firestore`
- `npm run seed:firestore:force`

## Important Files

- `src/providers/auth-provider.tsx`
- `src/app/api/users/me/route.ts`
- `src/app/api/reports/route.ts`
- `src/app/api/reports/[id]/route.ts`
- `src/components/map/map-workspace.tsx`
- `src/components/map/report-form.tsx`
- `src/components/map/report-list.tsx`
- `src/components/common/adaptive-board.tsx`
- `src/components/me/me-workspace.tsx`
- `src/components/iv/iv-workspace.tsx`
- `src/components/events/events-workspace.tsx`
- `src/features/events/presenter.ts`
- `scripts/seed-firestore.mjs`
