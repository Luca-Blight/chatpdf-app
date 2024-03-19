import { Pinecone } from '@pinecone-database/pinecone';
import { convertToAscii } from './utils';
import { getEmbeddings } from './embeddings';

export async function getMatchesfromEmbeddings(
  embeddings: number[],
  fileKey: string
) {
  const client = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
  const pineconeIndex = await client.Index('chatpdt');

  try {
    const asciiNamespace = convertToAscii(fileKey);

    const namespace = pineconeIndex.namespace(asciiNamespace);

    const queryResult = await namespace.query({
      topK: 5,
      vector: embeddings,
      includeMetadata: true,
    });
    return queryResult.matches || [];
  } catch (error) {
    console.log('error querying embeddings', error);
    throw error;
  }
}

export async function getContext(query: string, fileKey: string) {
  const queryEmbeddings = await getEmbeddings(query);
  const matches = await getMatchesfromEmbeddings(queryEmbeddings, fileKey);
  const qualifyingDocs = matches.filter(
    (match) => match.score && match.score > 0.7
  ); // only return matches with a score greater than 0.7, score measures relevance
  type Metadata = { text: string; pageNumber: number };

  let docs = qualifyingDocs.map((match) => (match.metadata as Metadata).text);
  // text of 5 vectors
  return docs.join('\n').substring(0, 30000);
}
