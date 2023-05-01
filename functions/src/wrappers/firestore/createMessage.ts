import * as functions from "firebase-functions";

import { createMessageEvent } from "../../functions/createMessageEvent";

export default functions
  .runWith({
    memory: "1GB",
    secrets: ["GPT_API_KEY"],
    timeoutSeconds: 540,
  })
  .firestore.document("chats/{chatId}/tmp/{messageId}")
  .onCreate(async (snap, context) => {
    await createMessageEvent(snap, context);
  });
