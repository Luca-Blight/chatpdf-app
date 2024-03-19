import { OpenAIApi, Configuration } from 'openai-edge';

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  
});
console.log('config', config);
console.log('api_key', process.env.OPENAI_API_KEY);

const openai = new OpenAIApi(config);

export async function getEmbeddings(text: string) {
  try {
    const response = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: text.replace(/\n/g, " "),
    });
    const result = await response.json();
    console.log('result:', result);
    console.log('result.data:', result.data);

    return result.data[0].embedding as number[];
  } catch (error) {
    console.log("error calling openai embeddings api", error);
    throw error;
  }
}

getEmbeddings("hello world").then((result) => {
    console.log('result', result);
}).catch((error) => {
    console.log('error', error);
});