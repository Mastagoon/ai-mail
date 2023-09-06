import type { Actions } from "@sveltejs/kit";
import { OPENAI_API_KEY } from "$env/static/private"
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export const actions: Actions = {
	default: async (event) => {
		console.log(OPENAI_API_KEY)
		// TODO log the user in
		if (!OPENAI_API_KEY)
			return {}
		const data = await event.request.formData()
		let prompt = data.get("prompt")?.toString()
		let ctx = data.get("context")?.toString()
		if (!prompt) return {}
		try {
			const comp = await openai.chat.completions.create({
				model: "gpt-3.5-turbo-16k",
				messages: [
					{
						role: "system",
						content: "Your function is to help create emails. The user will provide you the general context of the email and you will provide the text of the email."
					},
					{
						role: "user",
						content: ctx ?? ""
					},
					{
						role: "user",
						content: prompt
					}
				]
			})
			return { result: comp.choices[0].message.content }
		} catch (error) {
			return { error }
		}
	}
};
