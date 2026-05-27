import { onAuthStateChanged, signInAnonymously, type User } from "firebase/auth";
import { useEffect, useState } from "react";
import { getFirebaseAuth } from "../lib/firebase";

type AuthState = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
};

export const useAuth = (): AuthState & { retry: () => void } => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const retry = () => {
    setError(null);
    setIsLoading(true);
    setRetryCount((c) => c + 1);
  };

  useEffect(() => {
    const auth = getFirebaseAuth();

    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      if (nextUser) {
        setUser(nextUser);
        setIsLoading(false);
        setError(null);
        return;
      }

      try {
        await signInAnonymously(auth);
      } catch (err) {
        console.error(err);
        const code = (err as { code?: string }).code;

        if (code === "auth/configuration-not-found") {
          setError(
            "Firebase Authentication에서「익명」로그인을 켜 주세요. 콘솔 → Authentication → 로그인 방법 → 익명 → 사용 설정"
          );
        } else {
          setError(
            "Firebase 로그인에 실패했습니다. 익명 로그인 활성화 및 .env 프로젝트 ID를 확인하세요."
          );
        }
        setIsLoading(false);
      }
    });

    return unsubscribe;
  }, [retryCount]);

  return { user, isLoading, error, retry };
};
