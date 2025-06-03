import { Errors } from "@hey/data/errors";
import type { Context } from "hono";
import lensPg from "src/utils/lensPg";
import openRouter from "src/utils/openRouter";
import { z } from "zod";

const OpenAIResponseSchema = z.object({
  choices: z.array(z.object({ message: z.object({ content: z.string() }) }))
});

const translate = async (ctx: Context) => {
  try {
    const { post } = await ctx.req.json();

    const metadata = await lensPg.query(
      `
        SELECT content, language
        FROM post.metadata
        WHERE post = $1;
      `,
      [`\\x${post}`]
    );

    const text = metadata[0]?.content;

    if (!text) {
      return ctx.json({ success: false, error: "No content found" }, 400);
    }

    const completion = await openRouter.chat.completions.create({
      model: "google/gemma-3n-e4b-it:free",
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

    return ctx.json({ success: true, data: { text: translatedText } });
  } catch {
    return ctx.json({ success: false, error: Errors.SomethingWentWrong }, 500);
  }
};

export default translate;
