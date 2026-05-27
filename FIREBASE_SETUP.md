# Firebase 설정 가이드

## 1. Firebase 프로젝트 만들기

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. **프로젝트 추가** → 이름 예: `cheonwon-map`
3. Google Analytics는 선택 사항 (끄셔도 됩니다)

## 2. 웹 앱 등록

1. 프로젝트 개요 → **웹(`</>`)** 아이콘 클릭
2. 앱 닉네임 입력 → **앱 등록**
3. `firebaseConfig` 객체가 표시됩니다 → 아래 값을 `.env`에 복사

## 3. `.env` 파일 작성

프로젝트 루트 `cheonwon/.env` 예시:

```env
VITE_NAVER_MAP_KEY=네이버_지도_키

VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=프로젝트ID.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=프로젝트ID
VITE_FIREBASE_STORAGE_BUCKET=프로젝트ID.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

> **따옴표(`"`)와 끝에 쉼표(`,`)를 넣지 마세요.** JSON이 아니라 `KEY=값` 형식입니다.  
> 잘못된 예: `VITE_FIREBASE_API_KEY="AIza...",`

> `storageBucket`은 콘솔에 `appspot.com`으로 나올 수도 있습니다. 콘솔에 표시된 값을 그대로 쓰세요.

## 4. Authentication (익명 로그인)

1. Firebase Console → **Build** → **Authentication**
2. **시작하기** → **Sign-in method** 탭
3. **익명(Anonymous)** → **사용 설정** → 저장

(가족과 계정 공유가 필요하면 나중에 Google 로그인을 추가할 수 있습니다.)

## 5. Firestore Database

1. **Build** → **Firestore Database** → **데이터베이스 만들기**
2. **프로덕션 모드**로 시작 (아래 규칙을 배포할 예정)
3. 리전: `asia-northeast3 (Seoul)` 권장

## 6. 보안 규칙 배포

프로젝트에 포함된 `firestore.rules` 내용:

- `users/{본인 uid}/apartmentNotes/{aptId}` 만 읽기/쓰기 가능

배포 방법 (Firebase CLI):

```bash
npm install -g firebase-tools
firebase login
firebase init firestore   # 기존 프로젝트 선택, firestore.rules 경로: firestore.rules
firebase deploy --only firestore:rules
```

콘솔에서 직접 붙여넣기:

1. Firestore → **규칙** 탭
2. `firestore.rules` 파일 내용 **전체** 복사 → **게시**

### 규칙 게시 시 「알 수 없는 오류」가 나올 때

1. 브라우저 **새로고침** 후 다시 **게시** (시크릿 창 권장)
2. Firestore **데이터베이스**가 먼저 생성됐는지 확인 (빈 DB여도 됨)
3. **CLI로 배포** (콘솔 버그 우회):

```bash
npm install -g firebase-tools
firebase login
cd cheonwon
firebase deploy --only firestore:rules
```

4. 그래도 안 되면 임시로 아래 **테스트 규칙**을 게시해 저장이 되는지 확인한 뒤, 다시 `firestore.rules`로 교체:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

> 임시 규칙은 로그인만 하면 모든 경로에 쓸 수 있어 **개발용**입니다. 확인 후 반드시 원래 규칙으로 바꾸세요.

## 7. 데이터 구조

```
users/{uid}/apartmentNotes/{aptId}
  priority: 1~5 | null
  listingUrl: string
  memo: string
  updatedAt: timestamp
```

`aptId`는 `src/data/apartments.json`의 `id`와 동일합니다. (예: `dongbang`)

## 8. 실행

```bash
npm run dev
```

기존 `localStorage` 우선순위는 최초 Firebase 연결 시 자동으로 이전됩니다.

## 필요한 키 정리

| 변수 | 어디서 복사 |
|------|-------------|
| `VITE_FIREBASE_API_KEY` | 프로젝트 설정 → 일반 → 내 앱 → SDK 설정 |
| `VITE_FIREBASE_AUTH_DOMAIN` | 동일 |
| `VITE_FIREBASE_PROJECT_ID` | 동일 |
| `VITE_FIREBASE_STORAGE_BUCKET` | 동일 |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | 동일 |
| `VITE_FIREBASE_APP_ID` | 동일 |
| `VITE_NAVER_MAP_KEY` | 네이버 클라우드 플랫폼 Maps |
