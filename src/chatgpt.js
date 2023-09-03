import OpenAI from "openai";
import config from "config";

const CHATGPT_MODEL = "gpt-3.5-turbo";

const ROLES = {
  ASSISTANT: "assistant",
  SYSTEM: "system",
  USER: "user",
};

const openai = new OpenAI({
  apiKey: config.get("OPENAI_KEY"),
});

const getMessage = (m) =>
  `Напиши на основе этих тезисов последовательную эмоциальную историю: ${m} Эти тезисы с описанием ключевых моментов дня. Необходимо в итоге получить такую историю, чтоб я запомнил этот день и смог в последствии рассказать ее друзьям. Много текста не нужно, главное, чтоб были эмоции, правильная последовательность + учтение контекста.`;

export async function chatCPT(message = "") {
  const messages = [
    {
      role: ROLES.SYSTEM,
      content:
        "ТЫ опытный копирайтер, который пишет краткие эмоциональные статьи для соц сетей.",
    },
    {
      role: ROLES.USER,
      content: getMessage(message),
    },
  ];
  try {
    const completion = await openai.chat.completions.create({
      messages,
      model: CHATGPT_MODEL,
    });
    return completion.choices[0].message;
  } catch (error) {
    console.error("Error while chat completion", error.message);
  }
}
