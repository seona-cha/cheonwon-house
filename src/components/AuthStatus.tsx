import "./AuthStatus.scss";

type AuthStatusProps = {
  isLoading: boolean;
  error: string | null;
};

export const AuthStatus = ({ isLoading, error }: AuthStatusProps) => {
  if (error) {
    return (
      <div className="auth-status auth-status--error" role="alert">
        {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="auth-status" aria-live="polite">
        Firebase 연결 중…
      </div>
    );
  }

  return (
    <div className="auth-status auth-status--ok" aria-label="Firebase 연결됨">
      저장됨 (Firebase)
    </div>
  );
};
