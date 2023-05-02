// This original file is located in src/utils/common.ts.
// This is a file that is commonly used by vue and functions.
//  Do not directly edit files under functions
import { ChatCompletionRequestMessage } from "openai";

type ChatCompletionRequestMessageExt = ChatCompletionRequestMessage & {hasError: boolean};

export const historyTextCount = (histories: ChatCompletionRequestMessageExt[]) => {
  return (histories).reduce((tmp: number, c: any) => {
    if (!c.hasError) {
      // for ja.
      const len = stringLength(c.content);
      return tmp + len;
    }
    return tmp;
  }, 0);
};
export const historyCount = (histories: ChatCompletionRequestMessageExt[]) => {
  return (histories).reduce((tmp: number, c: any) => {
    if (!c.hasError && c.role === 'assistant') {
      return tmp + 1;
    }
    return tmp;
  }, 0);
}
export const stringLength = (text: string) => {
  return Array.from(text).length;
};

export const limitations = {
  free: {
    messageMaxLength: 200,
    maxNumberOfMessagesPerChat: 20,
    maxNumberOfChatsPerDay: 1,
    maxNumberOfMessagesPerUser: 10,
  },
  paidBasic: {
    messageMaxLength: 200,
    maxNumberOfMessagesPerChat: 20,
    maxNumberOfChatsPerDay: 100,
    maxNumberOfMessagesPerUser: 200,
  },
  // future feature,
  paidPro: {
    messageMaxLength: 200,
    maxNumberOfMessagesPerChat: 20,
    maxNumberOfChatsPerDay: 100,
    maxNumberOfMessagesPerUser: 200,
  },
};


