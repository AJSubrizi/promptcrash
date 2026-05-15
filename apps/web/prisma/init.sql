CREATE TABLE IF NOT EXISTS "Crash" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "projectName" TEXT NOT NULL,
  "environment" TEXT NOT NULL,
  "route" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "model" TEXT NOT NULL,
  "promptVersion" TEXT,
  "systemPrompt" TEXT,
  "userInput" TEXT,
  "retrievedContext" TEXT,
  "toolCalls" TEXT,
  "output" TEXT,
  "expectedBehavior" TEXT,
  "failureType" TEXT NOT NULL,
  "severity" TEXT NOT NULL,
  "reproducible" BOOLEAN NOT NULL DEFAULT false,
  "metadata" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "Crash_createdAt_idx" ON "Crash"("createdAt");
CREATE INDEX IF NOT EXISTS "Crash_failureType_idx" ON "Crash"("failureType");
CREATE INDEX IF NOT EXISTS "Crash_severity_idx" ON "Crash"("severity");
