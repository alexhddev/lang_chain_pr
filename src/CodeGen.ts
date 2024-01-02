import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from 'langchain/chains'
import { OpenAI } from 'langchain/llms/openai';

async function execute() {
    const model = new OpenAI({
        openAIApiKey: process.env.openapi_key
    })

    const prompt = new PromptTemplate({
        inputVariables: ['language', 'task'],
        template: "Write a very short {language} function that will {task}",
    });

    const codeChain = new LLMChain({
        llm: model,
        prompt: prompt,
    });

    const result = await codeChain.call(
        {
            language: 'javascript',
            task: 'add two numbers',
        }
    )

    console.log(result.text)

}

execute();