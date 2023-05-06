import { getStatisticsPath } from "./common";
import { specialUid, chatCreationlimit } from "../utils/project";

//  eslint-disable-next-line
export const createChatEvent = async (snap: any, context: any) => {
  const data = snap.data();

  const db = snap.ref.firestore;
  const { uid } = data;
  await snap.ref.update({ counter: 0 });

  const path = getStatisticsPath(uid);
  const statictics = (await db.doc(path).get()).data() || {};

  // limit
  if (!specialUid.includes(uid)) {
    if ((statictics.chatCounter || 0) >= chatCreationlimit) {
      await snap.ref.delete();
      return 
    }
  }
  const counter = (statictics.chatCounter || 0) + 1;
  const newData = { ...statictics, chatCounter: counter };
  await db.doc(path).set(newData);
};
