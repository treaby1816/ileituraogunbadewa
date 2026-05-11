import { ADUN_SYSTEM_PROMPT } from "./chatbot-prompt";
import { upsertKnowledge } from "./supabase-vector";

/**
 * Utility script to seed the initial chatbot knowledge base into Supabase pgvector.
 * This takes the monolithic system prompt and splits it into logical chunks.
 */
export async function seedKnowledgeBase() {
  console.log("Starting knowledge base seeding...");
  
  // Split the prompt by the divider blocks
  const sections = ADUN_SYSTEM_PROMPT.split("═══════════════════════════════════════════")
    .map(s => s.trim())
    .filter(s => s.length > 0);

  let successCount = 0;
  let failCount = 0;

  // The first section is usually the intro, skip if it's too short
  for (const section of sections) {
    if (section.length < 50) continue;
    
    // Extract a basic title if possible
    const lines = section.split("\n");
    const title = lines[0];

    try {
      await upsertKnowledge(section, { source: "system_prompt", title });
      successCount++;
      console.log(`✅ Seeded section: ${title}`);
    } catch (err) {
      failCount++;
      console.error(`❌ Failed to seed section: ${title}`);
    }
  }

  console.log(`Seeding complete. Success: ${successCount}, Failed: ${failCount}`);
  return { successCount, failCount };
}
