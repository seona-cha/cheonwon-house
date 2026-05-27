# 천원주택 후보 지도 (React)

계양구 천원주택 후보 아파트를 네이버 지도에서 보고, 방문 우선순위(1~5)를 저장하는 앱입니다.

## 실행

```bash
npm install
npm run dev
```

`.env` 파일에 네이버 지도 API 키를 설정합니다.

```
VITE_NAVER_MAP_KEY=your_ncp_key_id
```

## 프로젝트 구조

```
src/
  data/apartments.json   # 아파트 목록 (데이터 분리)
  styles/
    _variables.scss      # 색상, 간격, z-index 등 공통 변수
    _mixins.scss         # 닫기 버튼, 패널, 포커스 링 등
    global.scss          # body, 에러 화면
    info-window.scss     # 지도 팝업 (전역 클래스)
  components/            # 지도, 패널, 범례 UI (*.scss)
  hooks/                 # 지도 SDK 로드, 우선순위 상태
  utils/                 # 저장, 마커 아이콘, 정보창 HTML
```

스타일은 SCSS(`sass`)로 작성됩니다. Vite가 빌드 시 자동 컴파일합니다.

## Firebase

상세 설정: **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)**

`.env`에 Firebase 6개 값 + 네이버 지도 키를 넣은 뒤, 콘솔에서 **익명 로그인**과 **Firestore**를 활성화하세요.

## 아파트 데이터

`src/data/apartments.json` 각 항목의 `id`가 Firebase·localStorage 참조 키입니다.

```json
{ "id": "dongbang", "name": "동방", "address": "...", "year": "1979" }
```

동명 아파트(경신 등)는 서로 다른 `id`를 사용합니다. 기존 주소 기준 저장 데이터는 자동으로 `id` 기준으로 이전됩니다.

## 빌드

```bash
npm run build
npm run preview
```

## 레거시

기존 단일 HTML 버전: `naver-map.html`
