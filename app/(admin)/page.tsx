import { Button } from "@/components/ui/button";
import Link from "next/link";

const page = () => {
  return (
    <main className="p-10 bg-white m-10 rounded-md w-full">
      <h1 className="text-4xl font-light">
        Welcome to <span className="text-[#64B5F5] font-bold">Assistly!</span>
      </h1>
      <h2 className="mt-2 mb-10">
        Let&apos;s Build an AI Agent Web App Named: &quot;Assistly&quot;
      </h2>
      <Link href="/create-chatbot">
        <Button className="hover:bg-[#64B5F5] hover:text-white p-3 rounded-md mt-5 relative overflow-hidden">
          Let&apos;s Get Started by Creating your first AI Chatbot
        </Button>
      </Link>
    </main>
  );
};

export default page;
