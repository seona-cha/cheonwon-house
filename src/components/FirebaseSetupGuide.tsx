import "./FirebaseSetupGuide.scss";

const AUTH_CONSOLE_URL =
  "https://console.firebase.google.com/project/cheonwon-house/authentication/providers";

type FirebaseSetupGuideProps = {
  error: string;
  onRetry: () => void;
};

export const FirebaseSetupGuide = ({
  error,
  onRetry,
}: FirebaseSetupGuideProps) => (
  <div className="firebase-setup-guide" role="alert">
    <h2>Firebase 로그인 설정이 필요합니다</h2>
    <p className="firebase-setup-guide__lead">
      아래 오류는 <strong>Firestore 규칙과 무관</strong>합니다. 페이지에 들어올 때
      <strong> 익명 로그인</strong>이 필요한데, 콘솔에서 아직 켜지지 않았습니다.
    </p>
    <p className="firebase-setup-guide__error">{error}</p>

    <ol>
      <li>
        <a href={AUTH_CONSOLE_URL} target="_blank" rel="noopener noreferrer">
          Firebase Authentication (로그인 방법)
        </a>
        {" "}페이지를 엽니다.
      </li>
      <li>
        처음이면 <strong>시작하기</strong>를 눌러 Authentication을 활성화합니다.
      </li>
      <li>
        목록에서 <strong>익명(Anonymous)</strong>을 클릭합니다.
      </li>
      <li>
        <strong>사용 설정</strong>을 켜고 <strong>저장</strong>합니다.
      </li>
      <li>이 페이지로 돌아와 아래 버튼을 누릅니다.</li>
    </ol>

    <p className="firebase-setup-guide__project">
      연결 프로젝트: <code>cheonwon-house</code> (`.env`의
      `VITE_FIREBASE_PROJECT_ID`와 동일해야 합니다)
    </p>

    <button type="button" className="firebase-setup-guide__retry" onClick={onRetry}>
      다시 연결
    </button>
  </div>
);
