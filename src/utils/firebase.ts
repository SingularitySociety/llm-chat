import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";
import { getFirestore } from "firebase/firestore";

import { firebaseConfig, appCheckKey } from "@/config/project";

if (location.hostname === "localhost") {
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

const firebaseApp = initializeApp(firebaseConfig);

const appCheck = initializeAppCheck(firebaseApp, {
  provider: new ReCaptchaV3Provider(appCheckKey),
  isTokenAutoRefreshEnabled: true,
});

export const db = getFirestore();
export const auth = getAuth();
export const functions = getFunctions(firebaseApp, "asia-northeast1");
//export const functions = getFunctions(firebaseApp);
