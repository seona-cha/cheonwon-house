import { initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

const trimEnv = (value: string | undefined): string =>
  (value ?? "").replace(/^["'\s]+|["',\s]+$/g, "").trim();

const firebaseConfig = {
  apiKey: trimEnv(import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: trimEnv(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: trimEnv(import.meta.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: trimEnv(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: trimEnv(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: trimEnv(import.meta.env.VITE_FIREBASE_APP_ID),
};

export const isFirebaseConfigured = (): boolean =>
  Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId
  );

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

export const getFirebaseApp = (): FirebaseApp => {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase 환경 변수가 설정되지 않았습니다.");
  }
  if (!app) {
    app = initializeApp(firebaseConfig);
  }
  return app;
};

export const getFirestoreDb = (): Firestore => {
  if (!db) {
    db = getFirestore(getFirebaseApp());
  }
  return db;
};
