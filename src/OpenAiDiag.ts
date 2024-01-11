import OpenAI from 'openai'
import { readFileSync, existsSync, writeFileSync } from 'fs'

const openai = new OpenAI();

const history: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
        role: 'system',
        content: 'You are a very cool chatbot! All your answers come from a bro'
    },
    {
        role: 'system',
        content: `You must respond in JSON with this schema:
            {
                answer: string,
                coolness: soft, medium, hard, extreme
            }
        `
    }
];
console.log('Hello from cool chatbot!')
process.stdin.addListener('data', async function (input) {
    // await loadMessageHistory();
    let userInput = input.toString().trim();
    history.push({
        role: 'assistant',
        content: userInput
    })
    await createChatCompletion();
});

async function createChatCompletion(){
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        temperature: 0,
        messages: history
    })
    const responseMessage = response.choices[0].message;
    const messageParam: OpenAI.Chat.ChatCompletionMessageParam = {
        role:responseMessage.role,
        content: responseMessage.content
    }
    history.push(messageParam);
    console.log(`${messageParam.role}: ${messageParam.content}`)
}