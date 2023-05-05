import { getStatisticsPath } from "./common";

import { prompts } from "../utils/prompts";
import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from "openai";

import { historyTextCount, historyCount } from "../utils/common";

const gpt_token = process.env.GPT_API_KEY;

const configuration = new Configuration({
  apiKey: gpt_token,
});
const openai = new OpenAIApi(configuration);

export const ask = async (
  messages: ChatCompletionRequestMessage[],
  model = "gpt-3.5-turbo-0301"
) => {
  console.log(messages, model);
  try {
    const response = await openai.createChatCompletion({
      model: model,
      messages,
      temperature: 0.6,
    });

    const answer = response.data.choices[0].message;
    return answer;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const pickData = (array: string[]) => {
  const ret: string[] = [];
  [1,2,3].map(() => {
    const index = Math.floor(Math.random() * array.length);
    ret.push(array[index]);
    array.splice(index, 1);
  });
  return ret;
}
export const promptsContents = (prompt: any) => {
  const message = prompt.prompt.join("\n");
  if (prompt.data) {
    const array = [...prompt.data];
    const ret = pickData(array);
    const newMessage = ret.reduce((tmp: string, word: string) => {
      return tmp.replace("{random}", word)
    }, message);
    return newMessage;
  }
  return message;
};
   


//  eslint-disable-next-line
export const createMessageEvent = async (snap: any, context: any) => {
  const data = snap.data();
  // const { chatId } = context.params;
  const { message, uid } = data;
  console.log(message);

  const coll = await snap.ref.parent.get();
  if (coll.docs.length > 1) {
    // duplicate
    await snap.ref.delete();
    return;
  }
  
  const updateHistoryErrorAndDelete = async () => {
    const chatDataAgain = (await snap.ref.parent.parent.get()).data() || {};
    const histories = chatDataAgain.histories || [];

    histories.push({
      role: "user",
      hasError: true,
      content: message,
    });
    await snap.ref.parent.parent.update({ histories });

    await snap.ref.delete();
  };

  try {
    // TODO: magic number 200 should get from limitations from common.

    // if (stringLength(message) === 0 || stringLength(message) > 200) {
    if ((message || "").length > 1000) {
      await updateHistoryErrorAndDelete();
      return;
    }

    // const chatData = snap.ref.parent.parent.data();
    const chatData = (await snap.ref.parent.parent.get()).data() || {};
    const type = chatData.type;

    if (historyTextCount(chatData.histories || []) > 3000) {
      await updateHistoryErrorAndDelete();
      return;
    }
    if (historyCount(chatData.histories || []) > 10) {
      await updateHistoryErrorAndDelete();
      return;
    }

    const prompt = (prompts as any)[type];
    const messages: ChatCompletionRequestMessage[] = [];
    if (prompt) {
      messages.push({
        role: "system",
        content: promptsContents(prompt),
      });
    }
    if (chatData && chatData.histories) {
      chatData.histories.map(
        (h: ChatCompletionRequestMessage & { hasError: boolean }) => {
          if (!h.hasError) {
            messages.push(h);
          }
        }
      );
    }

    messages.push({
      role: "user",
      content: message + "(((日本語で答えてください)))",
    });

    const answer = await ask(messages, prompt.model || "gpt-3.5-turbo-0301");
    if (!answer) {
      // update failed
      await updateHistoryErrorAndDelete();
      return;
    }
    // console.log(answer?.content);

    //  update history
    // const path = snap.ref.parent.parent.path;
    const chatDataAgain = (await snap.ref.parent.parent.get()).data() || {};
    const histories = chatDataAgain.histories || [];
    histories.push({
      role: "user",
      content: message,
    });
    histories.push({
      role: answer?.role || "",
      content: answer?.content || "",
    });
    await snap.ref.parent.parent.update({ histories, counter: histories.length });

    await snap.ref.delete();

    // update counter
    const db = snap.ref.firestore;
    const path = getStatisticsPath(uid);
    const statictics = (await db.doc(path).get()).data() || {};
    const counter = (statictics.messageCounter || 0) + 1;
    const newData = { ...statictics, messageCounter: counter };
    await db.doc(path).set(newData);
  } catch (e) {
    console.log(e);
    await snap.ref.delete();
  }
};
