// This original file is located in src/utils/common.ts.
// This is a file that is commonly used by vue and functions.
//  Do not directly edit files under functions


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


