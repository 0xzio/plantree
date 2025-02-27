<<<<<<< Updated upstream
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
=======
const a = {
  key: `-----BEGIN RSA PRIVATE KEY-----
MIIEpQIBAAKCAQEArKtr09Ty90EAXdHFKRSV+mVJLlOrkKQP+uua05G0SxtB+ZRv
s7qmM0XdPl9TbHEwx6AHd66yoT1m3Pj5Jndvk/cozZ0p+cJFLIAW8JI8WMLfac0I
h6kfPj7WI0VTeTaqI63h3WyqIl5oZc1ycWOkl0O8PPVyRsnvwsUZH2EtJAbhkaBs
wG+M32u9TA3i37pS/Ak/cO19bl8F5QnoXcKW1t2xryjEKxc9JnseeML09ooN6PgI
a8sgwDtZ6XpMv8gzK2ZgxRaqawNEMAiREi7TJIke1xiKIZ34U/pLELIzgS3DOSG8
Pk/iJYtEJ+pmC0sf+H8VkvCaz5EjlTuIXduyjwIDAQABAoIBAQCHvedxy4oKSMaB
+wQVTIKvK2sBiXNprSCG8StxQa1MEiymiUPbNlOsITNR8lzB9qYTeUIFm4gAbCXu
d6heziwgVYB1TCWQnGIHHtdp3nykhuZd5XrcM19Fbt6nMbvyob/VdsAGc4O4qyFF
TuK2M1BUPkLAZXCmJ+Bd7NbYLWvwUlEuJN/x8pCmPcfWpU9wjFBA6hyFnTmGt7w1
n3p34A/8qxK2WRFh2qiSwz3Zxntcd4XIWnbub37zNM33kfGju3WcVuYzTdwjarHS
C0+jTViD1GmeXYDCQ0vkuYgHchHOILtxDRELCBOgJgLd2dGk/RieQGhbSaAd2Hlj
4O3w4kwxAoGBAOE5R7mVItFcnBqVtXgRsEecg7GfakfnvhC/MrI0qTC4dEEEJGcC
YMauKulGKKoUcqzmrWbsb40gYe6OIrNlMCKu2/EkzMBNMChJm734RMD40GLR4icQ
nztl5miMmZtt/Q5qLenxzCW1crZlmtSkErv+/YB6KsOkcEI19aoF2ycXAoGBAMRD
tKNVlQQr4QLh2M6M2WP05LSKwJ+TiBLwcm2PumZytUSOtzBo9GwT+SugqTklBvm8
roSnYTHLU/NF1mNZXb+QmPPL5SESEbXXXSZESevEBGSTIInQizs87RvyMLn7PNy6
rVAk94lqqCX9hCVXdyEP+aWJBOh3uGTuOuSrhvtJAoGBAI7hL8dj/TqkbcPPxdfu
IM7NVB6S63HCaqllIlw7XDo0SkwUvKM8tvhT9ZUXlSSQ5E8b6FWrGPmG2ZnlQc5d
GzRlidJpbhtw3GQyjkLuBXAGaOzICZiOyvV7p7gbujcIh8llQstvQfuKKMPdoWPU
0q3BDkE7P3XuE+ltIfRC0szxAoGBAJgUmsHCDEF6OtZ/6P9MlxtkZWAc8Fv29wct
+I07RUYjdqDUMdE6UsP4yihrSxWzwm78LQMvrBnoo3mr0Q+U7RcG1e58PWVd2gld
A5omal1du8WvWBRSW8EgWd9A0U8cBjJIGQo0SvfZhMhDZQWGfBJLjbger4XvVxwm
mc4dt++5AoGAC0enC8LhtTPsRdnPVzaiwykwq5rOnZfu9WeFZs0XZNE4tkAuQEVC
lpyVUBNGUodTBNwACu8Sg2YN2e8Qx4PuNrnlJa5Szch3gTpE8B90fLnuKJl7wOLR
UVvtD4GI9ascWXKonT79EqC+RSh1XZ9GaFuVYs7x5J954o3mQUy+jKM=
-----END RSA PRIVATE KEY-----`
}

console.log('===============');
console.log(JSON.stringify(a));
>>>>>>> Stashed changes
