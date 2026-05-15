import { seedDemoCrashes } from "../lib/demo-data";
import { db } from "../lib/db";

const result = await seedDemoCrashes();
await db.$disconnect();

console.log(`Seeded ${result.count} PromptCrash demo crashes.`);
