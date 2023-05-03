import * as admin from "firebase-admin";

import * as express from "express";
import * as fs from "fs";

import { title } from "../../i18n/title";

export const app = express();
export const router = express.Router();

const db = admin.firestore();

const validateFirebaseId = (id: string) => {
  return /^[a-zA-Z0-9]+$/.test(id);
};

const escapeHtml = (str: string): string => {
  if (typeof str !== "string") {
    return "";
  }
  const mapping: any = {
    "&": "&amp;",
    "'": "&#x27;",
    "`": "&#x60;",
    '"': "&quot;",
    "<": "&lt;",
    ">": "&gt;",
  };
  return str.replace(/[&'`"<>]/g, function (match) {
    return mapping[match];
  });
};

const ogpPage = async (req: any, res: any) => {
  const { chatId } = req.params;
  console.log(chatId);
  const template_data = fs.readFileSync("./templates/index.html", {
    encoding: "utf8",
  });
  res.setHeader("Content-Security-Policy", "frame-ancestors 'none'"),
  res.setHeader("X-Frame-Options", "deny");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("X-Permitted-Cross-Domain-Policies", "none");
  res.setHeader("Referrer-Policy", "no-referrer");

  try {
    if (!validateFirebaseId(chatId)) {
      return res.status(404).send(template_data);
    }
    const chatDoc = await db.doc(`chats/${chatId}`).get();

    if (!chatDoc || !chatDoc.exists) {
      return res.status(404).send(template_data);
    }
    const chat: any = chatDoc.data();

    const botName = (title as any)[chat.type as string] || "ボット";

    const siteName = "インプロ(imprompt)";
    const pageTitle = botName + " - インプロ(imprompt)";
    const description = chat.histories &&  chat.histories[0] ? ["質問", chat.histories[0].content].join(": ") : "";

    const image = chat.imageUrl || "";
    
    const regexTitle = /<title.*title>/;
    const url = "https://llm-chat-6aa15.web.app/" + req.path;

    const metas = [
      `<title>${escapeHtml(pageTitle)}</title>`,
      `<meta data-n-head="1" charset="utf-8">`,
      `<meta data-n-head="1" name="viewport" content="width=device-width,initial-scale=1">`,
      `<meta name="description" content="${escapeHtml(description)}"/>`,
      `<meta property="og:title" content="${escapeHtml(pageTitle)}" />`,
      `<meta property="og:site_name" content="${escapeHtml(siteName)}" />`,
      `<meta property="og:type" content="website" />`,
      `<meta property="og:url" content="${url}" />`,
      `<meta property="og:description" content="${escapeHtml(description)}" />`,
      `<meta property="og:image" content="${escapeHtml(image)}" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:site" content="@snakajima" />`,
      `<meta name="twitter:creator" content="@snakajima" />`,
      `<meta name="twitter:description" content="${escapeHtml(
        description
      )}" />`,
      `<meta name="twitter:image" content="${escapeHtml(image)}" />`,
    ];

    const regexBody = /<div id="app">/;

    const bodyString = [
      '<div id="app">',
      '<h1 style="font-size: 50px;">',
      escapeHtml(pageTitle),
      "</h1>",
      '<span style="font-size: 30px;">',
      escapeHtml(description),
      "</span>",
    ].join("\n");

    res.send(
      template_data
        .replace(/<meta[^>]*>/g, "")
        .replace(regexTitle, metas.join("\n"))
        .replace(regexBody, bodyString)
    );
  } catch (e) {
    console.log(e);
    res.send(template_data);
  }
};

router.get("/chats/:chatId", ogpPage);
router.get("/:lang/chats/:chatId", ogpPage);

app.use(express.json());
app.use("/", router);
