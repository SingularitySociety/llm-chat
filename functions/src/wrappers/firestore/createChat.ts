import * as functions from "firebase-functions";

import { createChatEvent } from "../../functions/createChatEvent";

export default functions
  .runWith({
    memory: "1GB",
    secrets: ["GPT_API_KEY"],
    timeoutSeconds: 540,
  })
  .firestore.document("chats/{chatId}")
  .onCreate(async (snap, context) => {
    await createChatEvent(snap, context);
  });
