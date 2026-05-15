"use server";

import { revalidatePath } from "next/cache";
import { seedDemoCrashes } from "@/lib/demo-data";

export async function seedDemoCrashesAction() {
  await seedDemoCrashes();
  revalidatePath("/");
}
