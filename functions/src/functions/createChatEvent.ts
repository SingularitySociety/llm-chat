import {
  getStatisticsPath
} from "./common";

//  eslint-disable-next-line
export const createChatEvent = async (snap: any, context: any) => {
  const data = snap.data();

  const db = snap.ref.firestore;
  const { uid } = data;

  const path = getStatisticsPath(uid);
  const statictics = (await db.doc(path).get()).data() || {}
  const counter = (statictics.chatCounter || 0) + 1;
  const newData = {...statictics, chatCounter: counter};
  await db.doc(path).set(newData);
  
};
