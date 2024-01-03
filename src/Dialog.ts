import { ChatOpenAI } from 'langchain/chat_models/openai';
import { LLMChain } from 'langchain/chains'
import { HumanMessagePromptTemplate, ChatPromptTemplate, MessagesPlaceholder } from 'langchain/prompts';
import { ConversationSummaryBufferMemory } from 'langchain/memory';

const prompt = new ChatPromptTemplate({
    inputVariables:['content', 'messages'],
    promptMessages:[
        new MessagesPlaceholder('messages'),
        HumanMessagePromptTemplate.fromTemplate('{content}')
    ],
})

const chatOpenAI = new ChatOpenAI();

const memory = new ConversationSummaryBufferMemory({
    memoryKey:'messages',
    returnMessages: true,
    llm:chatOpenAI
});

const chain = new LLMChain({
    llm: chatOpenAI,
    prompt: prompt,
    memory: memory,
});

process.stdin.addListener('data', async function(input) {
    let userInput = input.toString().trim();

    const result = await chain.call({
        content: userInput
    });
    console.log(result.text);
});