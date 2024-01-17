import OpenAI from 'openai'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { Embedding } from 'openai/resources';

const openai = new OpenAI();

export async function generateEmbedding(input: string) {
    const response = await openai.embeddings.create({
        input: input,
        model: 'text-embedding-ada-002'
    })
    return response;
}

async function mainz(){
    console.trace();
    const path = join(__dirname, 'data.json');
    const rawData = readFileSync(path);
    const data:string[] = JSON.parse(rawData.toString());
    const dataWithEmbeddings:{
        input: string,
        embedding: Array<Embedding>
    }[]
     = [];
    for (const input of data){
        const response = await generateEmbedding(input);
        console.log(`got embedding for ${input}`)
        dataWithEmbeddings.push({
            input: input,
            embedding: response.data
        })
    }
    saveDataToJsonFile(dataWithEmbeddings, 'dataWithEmbeddings.json'); 
}



function saveDataToJsonFile(data: any, fileName: string){
    console.log(`saving data to ${fileName}`);
    const dataString = JSON.stringify(data);
    const dataBuffer = Buffer.from(dataString);
    const path = join(__dirname, fileName);
    writeFileSync(path, dataBuffer);
    console.log(`saved data to ${fileName}`);
}

// mainz();