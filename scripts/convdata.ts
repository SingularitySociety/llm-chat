const fs = require("fs");

const main = () => {
  const base = "./node_modules/slashGPT/prompts/";
  const dir = fs.readdirSync(base);

  const ret: {[key: string]: {
    title: string,
    source: string,
    prompt: string[]
  }} = {};
  for (const file of dir) {
    if (/json/.test(file)) {
      const filePath = base + file;
      const key = file.split(".")[0];
      // console.log(filePath);
      const json = JSON.parse(fs.readFileSync(filePath).toString());
      console.log(json);
      ret[key] = json;
    }
  }
  console.log(ret);

  fs.writeFileSync("./src/utils/prompts.ts", "export const prompts = " + JSON.stringify(ret, null, 2));
};

main();
