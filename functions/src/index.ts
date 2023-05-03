import * as admin from "firebase-admin";
// import * as functions from "firebase-functions";

import exportIfNeeded from "./common/exportifneeded";

if (!admin.apps.length) {
  admin.initializeApp();
}

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// exportIfNeeded("test", "tests/test", exports);

exportIfNeeded("createMessageTrigger", "firestore/createMessage", exports);
exportIfNeeded("createChatTrigger", "firestore/createChat", exports);
exportIfNeeded("updateChatTrigger", "firestore/updateChat", exports);

exportIfNeeded("express", "express", exports);
