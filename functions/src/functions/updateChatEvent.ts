import { title } from "../i18n/title";
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
 
    const text = [
      ["質問", chatData.histories[0].content].join(": "),
      [
        // (title as any)[chatData.histories[1].role as string] || "ボット",
        (title as any)[chatData.type as string] || "ボット",
        chatData.histories[1].content,
      ].join(": "),
    ].join("\n");

    const file = await createImage(text);
    const imageUrl = await uploadImage(file, chatId);

    change.after.ref.update({ imageStatus: 10, imageUrl });
    console.log("AA", file);
  }
};
