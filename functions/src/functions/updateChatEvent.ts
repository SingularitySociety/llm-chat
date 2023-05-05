// import { title } from "../i18n/title";
import { bot } from "../i18n/bot";
// import { you } from "../i18n/you";
import { createImage, uploadImage } from "./image";

// imageStatus
const start = 1;

//  eslint-disable-next-line
export const updateChatEvent = async (change: any, context: any) => {
  const chatData = change.after.data();
  const chatId = change.after.ref.id;

  if (
    chatData.histories &&
    chatData.histories.length > 1 &&
    chatData.imageStatus === undefined
  ) {
    change.after.ref.update({ imageStatus: start });

    /*
    const text = [
      [(you as any)[chatData.type] || "質問", chatData.histories[0].content].join(": "),
      [
        // (title as any)[chatData.histories[1].role as string] || "ボット",
        (bot as any)[chatData.type] || "回答",
        chatData.histories[1].content,
      ].join(": "),
    ].join("\n");
    */
    const text = chatData.histories[1].content;
    const name = (bot as any)[chatData.type] || "回答";

    const file = await createImage(text, name);
    const imageUrl = await uploadImage(file, chatId);

    change.after.ref.update({ imageStatus: 10, imageUrl });
  }
};
