import { OpenAI } from 'langchain/llms/openai';

async function execute(){
    const model = new OpenAI({
        openAIApiKey: process.env.openapi_key
    })
    const response = await model.call(
        'Give me some Ron Swanson quotes in JSON format',
    );
    console.log(response);
}



execute();

