import ApolloProviderWrapper from "@/components/ApolloProvider";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Assistly - AI Agent",
  description:
    "Assistly is an AI agent that talks with your customers being like you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ApolloProviderWrapper>
      <ClerkProvider>
        <html lang="en">
          <body className={`min-h-screen flex`}>{children}</body>
        </html>
      </ClerkProvider>
    </ApolloProviderWrapper>
  );
}
