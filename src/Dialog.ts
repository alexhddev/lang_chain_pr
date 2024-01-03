import { ChatOpenAI } from 'langchain/chat_models/openai';
import { LLMChain } from 'langchain/chains'
import { HumanMessagePromptTemplate, ChatPromptTemplate, MessagesPlaceholder } from 'langchain/prompts';
import { ConversationSummaryBufferMemory, ChatMessageHistory } from 'langchain/memory';
import { readFileSync, existsSync, writeFileSync } from 'fs'


// NOT WORKING MESSAGE HISTORY LOADING FROM JSON!!!


const prompt = new ChatPromptTemplate({
    inputVariables: ['content', 'messages'],
    promptMessages: [
        new MessagesPlaceholder('messages'),
        HumanMessagePromptTemplate.fromTemplate('{content}')
    ],
})

const chatOpenAI = new ChatOpenAI();
const messageHistory = new ChatMessageHistory();

const memory = new ConversationSummaryBufferMemory({
    memoryKey: 'messages',
    returnMessages: true,
    llm: chatOpenAI,
    chatHistory: messageHistory
});

const chain = new LLMChain({
    llm: chatOpenAI,
    prompt: prompt,
    memory: memory,
});

process.stdin.addListener('data', async function (input) {
    // await loadMessageHistory();
    let userInput = input.toString().trim();

    const result = await chain.call({
        content: userInput
    });
    console.log(result.text);
    await saveMessageHistory();
});

async function loadMessageHistory() {
    if (existsSync('messages.json')) {
        const file = readFileSync('messages.json')
        const messages = JSON.parse(file.toString());
        for (const message of messages) { // Fix the type of 'message' variable
            await messageHistory.addMessage(message);
        }
    }
}

async function saveMessageHistory() {
    const messages = await messageHistory.getMessages();
    const file = JSON.stringify(messages);
    writeFileSync('messages.json', file);
}