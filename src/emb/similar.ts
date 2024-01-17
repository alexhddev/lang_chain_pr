import { generateEmbedding } from "./main";

function dotProduct(a: number[], b: number[]) {
    return a.map((value, index) => value * b[index]).reduce((a, b) => a + b, 0);
}

function cosineSimilarity(a: number[], b: number[]) {
    const dotProduct = a.map((value, index) => value * b[index]).reduce((a, b) => a + b, 0);
    const aMagnitude = Math.sqrt(a.map(value => value * value).reduce((a, b) => a + b, 0));
    const bMagnitude = Math.sqrt(b.map(value => value * value).reduce((a, b) => a + b, 0));
    return dotProduct / (aMagnitude * bMagnitude);
}


async function main() {

    const keyWord = 'dog';

    const embedding = await generateEmbedding(keyWord);

    const dataWithEmbeddings = await import('./dataWithEmbeddings.json');


    const similarities: { input: string, similarity: number }[] = [];
    for (const data of dataWithEmbeddings.default) {
        const similarity = dotProduct(
            embedding.data[0].embedding, 
            data.embedding[0].embedding);
            similarities.push({
                input: data.input,
                similarity: similarity
            })
    }
    console.log(`Cosine Similarity of ${keyWord} with:`);
    const sortedSimilarity = similarities.sort((a, b) => b.similarity - a.similarity);
    sortedSimilarity.forEach(similarity => {
        console.log(`${similarity.input}: ${similarity.similarity}`);
    });
    const a = 4;
}

main();