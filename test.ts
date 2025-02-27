import OpenAI from 'openai'

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey:
    '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',
  // defaultHeaders: {
  //   'HTTP-Referer': '<YOUR_SITE_URL>', // Optional. Site URL for rankings on openrouter.ai.
  //   'X-Title': '<YOUR_SITE_NAME>', // Optional. Site title for rankings on openrouter.ai.
  // },
})

async function main() {
  const completion = await openai.chat.completions.create({
    // model: 'openai/gpt-4o',
    model: 'deepseek/deepseek-r1-distill-llama-70b:free',
    // model: 'deepseek/deepseek-chat:free',
    // model: 'deepseek/deepseek-r1:free',
    messages: [
      {
        role: 'user',
        content:
          '请翻译以下文本成中文："OpenRouter strives to provide access to every potentially useful text-based AI model. We currently support over 300 models endpoints."',
      },
    ],
  })

  console.log(completion.choices)
}

main()
