# AI Handoff

## Session Summary

- Firebase Auth 실제 연결 상태를 기준으로 `AuthProvider`가 로그인/로그아웃, `getIdToken()`, 관리자 여부 판별을 제공한다.
- 로그인 상태가 바뀌면 `POST /api/users/me`로 Firestore `users/{uid}` 문서를 sync한다.
- `GET /api/users/me`도 추가해서 마이페이지에서 사용자 문서를 읽을 수 있게 했다.
- 후기 작성은 `src/components/map/report-form.tsx`에서 실제 `POST /api/reports` 호출로 연결했다.
- 지도 화면은 `src/components/map/map-workspace.tsx`에서 선택된 바이옴 기준으로 상세 패널, 후보 목록, 후기 목록, 후기 작성이 함께 움직인다.
- 후기 목록은 `src/components/map/report-list.tsx`에서 작성자 본인 또는 관리자가 새로고침 없이 수정/삭제할 수 있다.
- `src/components/common/adaptive-board.tsx`에 페이지별 `localStorage` 저장, 초기화 버튼, 단순 충돌 방지를 넣었다.
- IV 계산기는 `src/components/iv/iv-workspace.tsx`와 `/api/iv`를 연결해서 입력/결과가 실제로 바뀌게 했다.
- Firestore seed 스크립트 `scripts/seed-firestore.mjs`와 `package.json` 스크립트를 추가했다.
- 이벤트 화면은 `src/components/events/events-workspace.tsx` 기준으로 상태/태그 필터, 브리핑 패널, 타임라인, 상세 진입 카드 구조로 확장했다.
- 이벤트 관련 순수 helper는 `src/features/events/presenter.ts`에 모아뒀다.

## Important Constraints

- 사용자가 Firebase Console 쪽 선행 작업은 이미 끝냈다고 말했다.
- 사용자가 `build`, `typecheck`, `dev` 실행 같은 검증은 하지 말라고 명시했다.
- 그래서 이 세션에서는 실행 검증을 하지 않았고, 코드/문서 정리 중심으로 진행했다.

## Recommended Next Order

1. `MapLibre GL JS` 실제 지도 적용
2. IV 계산 로직 정밀화
3. 이벤트 관리자 액션도 새로고침 없이 반영되게 개선
4. 사용자 친화적인 후기 수정 UI 추가
5. 사용자가 허용하면 build/typecheck 실행

## Key Files

- `src/providers/auth-provider.tsx`
- `src/app/api/users/me/route.ts`
- `src/app/api/reports/route.ts`
- `src/app/api/reports/[id]/route.ts`
- `src/components/map/map-workspace.tsx`
- `src/components/map/report-list.tsx`
- `src/components/map/biome-map.tsx`
- `src/components/map/report-form.tsx`
- `src/components/common/adaptive-board.tsx`
- `src/components/me/me-workspace.tsx`
- `src/components/iv/iv-workspace.tsx`
- `src/components/events/events-workspace.tsx`
- `src/features/events/presenter.ts`
- `scripts/seed-firestore.mjs`

## Notes

- `src/components/layout/header.tsx`는 현재 사용하지 않는다. `app-shell.tsx`는 하단 네비와 본문만 렌더링한다.
- `AdaptiveBoard`는 저장된 레이아웃을 먼저 읽고, 그다음에만 `localStorage`에 다시 쓰도록 처리했다.
- `biome_regions.geometry`와 MapLibre 렌더링은 아직 없다. 현재 지도는 선택 가능한 프리뷰 레벨이다.
- `features/iv/calculator.ts`는 아직 placeholder 계산식이다.
- `src/app/api/reports/[id]/route.ts`는 PATCH에도 기본 validation을 넣어뒀다.
- 이번 세션에서도 `build`, `typecheck`, `dev`는 사용자 요청 때문에 실행하지 않았다.
