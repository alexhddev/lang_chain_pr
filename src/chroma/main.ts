import { ChromaClient, } from 'chromadb'
const chroma = new ChromaClient();
async function main() {

    const collection = await chroma.createCollection({ name: "test-from-js" });
    for (let i = 0; i < 20; i++) {
        await collection.add({
            ids: ["test-id-" + i.toString()],
            embeddings: [1, 2, 3, 4, 5],
            documents: ["test"],
        });
    }
    const queryData = await collection.query({
        queryEmbeddings: [1, 2, 3, 4, 5],
        queryTexts: ["test"],
    });
    console.log(queryData);
}
main();