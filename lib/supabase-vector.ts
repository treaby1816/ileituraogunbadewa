import { createServiceClient } from "./supabase-server";
import { getChatModel } from "./gemini";

const EMBEDDING_MODEL = "text-embedding-004";
const EMBEDDING_DIMENSIONS = 768;

/**
 * Generate a vector embedding for a given text using Gemini
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw new Error("Failed to generate embedding");
  }
}

/**
 * Search for similar knowledge base documents using pgvector
 */
export async function searchSimilarKnowledge(queryText: string, threshold = 0.7, count = 5) {
  try {
    const queryEmbedding = await generateEmbedding(queryText);
    const supabase = await createServiceClient();

    const { data, error } = await supabase.rpc("match_documents", {
      query_embedding: queryEmbedding,
      match_threshold: threshold,
      match_count: count,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Vector search error:", error);
    return [];
  }
}

/**
 * Upsert a knowledge document with its embedding
 */
export async function upsertKnowledge(content: string, metadata: any = {}) {
  try {
    const embedding = await generateEmbedding(content);
    const supabase = await createServiceClient();

    const { error } = await supabase.from("documents").insert({
      content,
      metadata,
      embedding,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Upsert knowledge error:", error);
    return false;
  }
}
