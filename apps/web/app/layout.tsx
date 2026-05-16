import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PromptCrash",
  description: "PromptCrash turns bad LLM outputs into reproducible bugs."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <main className="mx-auto w-full max-w-6xl px-4 py-7 md:px-6 md:py-10">{children}</main>
      </body>
    </html>
  );
}
