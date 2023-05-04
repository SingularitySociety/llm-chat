const fs = require("fs");

const main = () => {
  const base = "./node_modules/slashGPT/prompts/";
  const dir = fs.readdirSync(base);

  const prompts: {[key: string]: {
    title: string,
    source: string,
    prompt: string[]
  }} = {};
  const titles: {[key: string]: string} = {loading: "読込中...."};
  const bots: {[key: string]: string} = {};
  const yous: {[key: string]: string} = {};
  
  for (const file of dir) {
    if (/json/.test(file)) {
      const filePath = base + file;
      const key = file.split(".")[0];
      // console.log(filePath);
      const json = JSON.parse(fs.readFileSync(filePath).toString());
      console.log(json.language);
      if (json.language && json.language.includes("ja")) {
        prompts[key] = json;
        if (json.title) {
          titles[key] = json.title;
        }
        if (json.bot) {
          bots[key] = json.bot;
        }
        if (json.you) {
          yous[key] = json.you;
        }
      }
    }
  }
  console.log(prompts);

  fs.writeFileSync("./src/utils/prompts.ts", "export const prompts = " + JSON.stringify(prompts, null, 2));
  fs.writeFileSync("./src/i18n/ja/title.ts", "export const title = " + JSON.stringify(titles, null, 2));
  fs.writeFileSync("./src/i18n/ja/bot.ts", "export const bot = " + JSON.stringify(bots, null, 2));
  fs.writeFileSync("./src/i18n/ja/you.ts", "export const you = " + JSON.stringify(yous, null, 2));

  fs.writeFileSync("./src/i18n/en/title.ts", "export const title = " + JSON.stringify(titles, null, 2));
  fs.writeFileSync("./src/i18n/en/bot.ts", "export const bot = " + JSON.stringify(bots, null, 2));
  fs.writeFileSync("./src/i18n/en/you.ts", "export const you = " + JSON.stringify(yous, null, 2));

};

main();
