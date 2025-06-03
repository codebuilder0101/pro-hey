import { Errors } from "@hey/data/errors";
import type { Context } from "hono";
import getDbPostId from "src/utils/getDbPostId";
import lensPg from "src/utils/lensPg";
import openRouter from "src/utils/openRouter";
import { generateExtraLongExpiry, getRedis, setRedis } from "src/utils/redis";
import { z } from "zod";

const OpenAIResponseSchema = z.object({
  choices: z.array(z.object({ message: z.object({ content: z.string() }) }))
});

const translate = async (ctx: Context) => {
  try {
    const { post } = await ctx.req.json();
    const cacheKey = `ai:translate:${post}`;
    const cachedData = await getRedis(cacheKey);

    if (cachedData) {
      return ctx.json({ success: true, data: { text: cachedData } });
    }

    const metadata = await lensPg.query(
      `
        SELECT content, language
        FROM post.metadata
        WHERE post = $1;
      `,
      [getDbPostId(post)]
    );

    const text = metadata[0]?.content;

    if (!text) {
      return ctx.json({ success: false, error: "No content found" }, 400);
    }

    const completion = await openRouter.chat.completions.create({
      model: "shisa-ai/shisa-v2-llama3.3-70b:free",
      messages: [
        {
          role: "user",
          content:
            "You are a translation assistant. Translate all incoming text to English, and return only the translated output."
        },
        { role: "user", content: text }
      ]
    });

    const parsed = OpenAIResponseSchema.parse(completion);
    const translatedText = parsed.choices[0].message.content;
    await setRedis(cacheKey, translatedText, generateExtraLongExpiry());

    return ctx.json({ success: true, data: { text: translatedText } });
  } catch {
    return ctx.json({ success: false, error: Errors.SomethingWentWrong }, 500);
  }
};

export default translate;
