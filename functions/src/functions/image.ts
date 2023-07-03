import * as admin from "firebase-admin";

import { createCanvas, registerFont, loadImage } from "canvas";
import * as path from "path";
import * as fs from "fs";
import * as os from "os";
import { v4 as uuidv4 } from "uuid";

registerFont("tools/Noto_Sans_JP/static/NotoSansJP-Bold.ttf", {
  family: "noto",
});

const bgImagePath = "tools/images/OGP-Base.png";

const canvasW = 1200;
const canvasH = 630;

export const createImage = async (text: string, name: string) => {
  const canvas = createCanvas(canvasW, canvasH);
  const ctx = canvas.getContext("2d");

  // image
  const image = await loadImage(bgImagePath);
  ctx.drawImage(image, 0, 0, canvasW, canvasH);

  const offsetX = 80;
  const offsetY = 40;

  // text
  const boxW = canvasW - offsetX * 2; // x
  const boxH = 380;
  const fontSize = 30 * 2;
  const fontSizeAscii = fontSize * 0.56;
  const textH = Math.floor(fontSize * 1.22);
  ctx.font = `${fontSize}px "noto"`;

  const chars = text.split("");

  const newData: string[][] = [[]];

  let w = 0;
  let index = 0;
  for (const char of chars) {
    const wSize = char.match(/^[\x20-\x7e]*$/) ? fontSizeAscii : fontSize;

    if (char === "\n" || w + wSize > boxW) {
      index++;
      if (index * textH >= boxH) {
        break;
      }
      newData[index] = [] as string[];
      if (char !== "\n") {
        newData[index].push(char);
        w = wSize;
      } else {
        w = 0;
      }
    } else {
      newData[index].push(char);
      w += wSize;
    }
  }

  // console.log(newData);
  for (const index in newData) {
    ctx.fillText(
      newData[index].join(""),
      offsetX,
      offsetY + (Number(index) + 1) * textH
    );
  }
  // end of message

  // name
  ctx.fillStyle = "#ffffff";
  ctx.fillText(name, 40, 590);

  const tmpResizeFile = path.join(os.tmpdir(), uuidv4());
  const saveFile = () => {
    return new Promise((resolve, reject) => {
      const out = fs.createWriteStream(tmpResizeFile);
      canvas.createPNGStream().pipe(out);
      out.on("finish", resolve);
      out.on("error", reject);
    });
  };

  await saveFile();
  return tmpResizeFile;
};

export const uploadImage = async (localFileName: string, chatId: string) => {
  const storage = admin.storage();
  const bucket = storage.bucket();
  const uuid = uuidv4();
  const contentType = "image/png";
  const toFileFullPath = `images/chat/${chatId}.png`;

  const ret = await bucket.upload(localFileName, {
    destination: toFileFullPath,
    metadata: {
      contentType: contentType,
      metadata: {
        firebaseStorageDownloadTokens: uuid,
      },
    },
  });

  // generate public image url see: https://stackoverflow.com/questions/42956250/get-download-url-from-file-uploaded-with-cloud-functions-for-firebase
  const file = ret[0];
  return `https://firebasestorage.googleapis.com/v0/b/${
    bucket.name
  }/o/${encodeURIComponent(file.name)}?alt=media&token=${uuid}`;
};
