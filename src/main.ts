import { PDFLoader } from "langchain/document_loaders/fs/pdf";

export const run = async () => {
  const loader = new PDFLoader("src/1.pdf");

  const docs = await loader.load();

  console.log(process.env.STAGE)
  console.log({ docs });
};

run();

