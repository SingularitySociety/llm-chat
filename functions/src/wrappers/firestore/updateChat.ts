import * as functions from "firebase-functions";

import { updateChatEvent } from "../../functions/updateChatEvent";

export default functions
  .runWith({
    memory: "1GB",
    timeoutSeconds: 540,
  })
  .firestore.document("chats/{chatId}")
  .onUpdate(async (change, context) => {
    await updateChatEvent(change, context);
  });
