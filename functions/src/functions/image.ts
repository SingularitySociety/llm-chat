import * as admin from "firebase-admin";

import { createCanvas, registerFont } from "canvas";
import * as path from "path";
import * as fs from "fs";
import * as os from "os";
import { v4 as uuidv4 } from "uuid";


registerFont("Noto_Sans_JP/static/NotoSansJP-SemiBold.ttf", {family: "noto"})

export const createImage = async (text: string) => {
  const canvas = createCanvas(640, 480);
  const ctx = canvas.getContext("2d");

  const boxW = 600;
  const boxH = 380;
  const size = 36;
  const sizeAscii = 21.5;
  const sizeH = 44;
  ctx.font = "36px \"noto\""; 
  
  const chars = text.split("");
  
  const newData: string[][] = [[]];
  
  let w = 0;
  let index = 0;
  for(const char of chars) {
    const wSize = (char.match(/^[\x20-\x7e]*$/)) ? sizeAscii : size;
    
    if (char === "\n" || w + wSize > boxW) {
      index++;
      if (index * sizeH >= boxH) {
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

  console.log(newData);
  const x = 40;
  for(const index in newData) {
    ctx.fillText(newData[index].join(""), x,  20 + (Number(index) + 1) * sizeH);
  }

  const tmpResizeFile = path.join(os.tmpdir(), uuidv4());
  const saveFile = () => {
    return new Promise((resolve, reject) => {
      const out = fs.createWriteStream(tmpResizeFile)
      canvas.createPNGStream().pipe(out);
      out.on("finish", resolve);
      out.on("error", reject);
    });
  }
  
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
  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media&token=${uuid}`;

  
};
