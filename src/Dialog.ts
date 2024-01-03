import { ChatOpenAI } from 'langchain/chat_models/openai';
import { LLMChain } from 'langchain/chains'
import { HumanMessagePromptTemplate, ChatPromptTemplate } from 'langchain/prompts';

const prompt = new ChatPromptTemplate({
    inputVariables:['content'],
    promptMessages:[HumanMessagePromptTemplate.fromTemplate('{content}')]
})

const chain = new LLMChain({
    llm: new ChatOpenAI(),
    prompt: prompt
});





process.stdin.addListener('data', async function(input) {
    let userInput = input.toString().trim();

    const result = await chain.call({
        content: userInput
    });
    console.log(result.text);
});