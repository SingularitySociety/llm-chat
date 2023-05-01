import {prompts } from "../utils/prompts";
import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from "openai";


const gpt_token = process.env.GPT_API_KEY;

const configuration = new Configuration({
  apiKey: gpt_token,
});
const openai = new OpenAIApi(configuration);

export const ask = async (messages: ChatCompletionRequestMessage[], model = "gpt-3.5-turbo-0301") => {
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

//  eslint-disable-next-line
export const createMessageEvent = async (snap: any, context: any) => {
  const data = snap.data();
  // const { chatId } = context.params;
  const { message } = data;
  console.log(message);
  
  // const chatData = snap.ref.parent.parent.data();
  const chatData = (await snap.ref.parent.parent.get()).data() || {};
  const type = chatData.type;
  
  const prompt = (prompts as any)[type];
  const messages: ChatCompletionRequestMessage[]  = [];
  if (prompt) {
    messages.push({
      role: "system",
      content: prompt.prompt.join("\n")
    });
  }
  if (chatData && chatData.histories) {
    chatData.histories.map((h: (ChatCompletionRequestMessage & {hasError: boolean})) => {
      if (!h.hasError) {
        messages.push(h);
      }
    });
  }

  messages.push({
    role: "user",
    content: message,
  })

  const answer = await ask(messages);
  if (!answer) {
    // update failed
    const chatDataAgain = (await snap.ref.parent.parent.get()).data() || {};
    const histories = chatDataAgain.histories || [];

    histories.push({
      role: "user",
      hasError: true,
      content: message,
    });
    await snap.ref.parent.parent.update({histories});
    
    await snap.ref.delete();
    
    return;
  }
  console.log(answer?.content);

  
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
  await snap.ref.parent.parent.update({histories});

  await snap.ref.delete();
  
};
