import { PromptTemplate } from "langchain/prompts";
import { LLMChain, SequentialChain } from 'langchain/chains'
import { OpenAI } from 'langchain/llms/openai';

async function execute() {
    const model = new OpenAI()

    const codePrompt = new PromptTemplate({
        inputVariables: ['language', 'task'],
        template: "Write a very short {language} function that will {task}.",
    });

    const unitTestPrompt = new PromptTemplate({
        inputVariables: ['language', 'code'],
        template: "Write a unit test for a {language} function that will test without comments the following code:\n{code}",
    });

    const codeChain = new LLMChain({
        llm: model,
        prompt: codePrompt,
        outputKey:'code',
    });
    const testChain = new LLMChain({
        llm: model,
        prompt: unitTestPrompt,
        outputKey:'test',
    });
    const chain = new SequentialChain({
        chains: [codeChain, testChain],
        inputVariables: ['language', 'task'],
        outputVariables: ['code', 'test'],
    
    });

    const result = await chain.call(
        {
            language: 'javascript',
            task: 'add two numbers',
        }
    )
    console.log('*****code:*****')
    console.log(result.code)
    console.log('*****test:*****')
    console.log(result.test)

}

execute();