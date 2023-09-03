import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import config from "config";
import { chatCPT } from "./chatgpt.js";
import { create } from "./notion.js";
import { Loader } from "./loader.js";

const bot = new Telegraf(config.get("TELEGRAM_TOKEN"), {
  handlerTimeout: Infinity,
});

bot.command("start", (ctx) => {
  ctx.reply(
    "Добро пожаловать в бота. Отправьте текстовое сообщение с тезисами про историю."
  );
});

bot.on(message("text"), async (ctx) => {
  try {
    const text = ctx.message.text;
    if (!text.trim()) ctx.reply("Текст не может быть пустым");

    const loader = new Loader(ctx);

    loader.show();

    const response = await chatCPT(text);

    if (!response) return ctx.reply("Ошибка с API", response);

    const notionResponse = await create(text, response.content);

    loader.hide();

    ctx.reply(`Ваша страница: ${notionResponse.url}`);
  } catch (error) {
    console.log("Error while processing text: ", error.message);
  }
});

bot.launch();
