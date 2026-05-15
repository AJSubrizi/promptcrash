import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PromptCrash Support Agent Example"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
