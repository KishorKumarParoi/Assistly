"use client";

import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CREATE_CHATBOT } from "@/graphql/mutation/mutations";
import { useMutation } from "@apollo/client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const CreateChatBot = () => {
  const { user } = useUser();

  const [name, setName] = useState("");
  const router = useRouter();

  const [CreateChatBot, { data, loading, error }] = useMutation(
    CREATE_CHATBOT,
    {
      variables: {
        clerk_user_id: user?.id,
        name,
        created_at: new Date().toISOString(),
      },
    }
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = await CreateChatBot();
      console.log("🚀 ~ handleSubmit ~ data", data);
      setName("");
      router.push("/edit-chatbot/" + data.data.insertChatbots.id);
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error", error);
    }
  };

  if (!user) return null;
  console.log("Data >>", data);

  if (error) {
    console.log("Error >>", error);
  }

  return (
    <div className="flex flex-col items-center justify-center md:flex-row md:space-x-10 bg-white p-10 rounded-md m-10">
      <Avatar seed="Create Chatbot" />
      <div>
        <h1 className="text-xl lg:text-3xl font-semibold">Create</h1>
        <h2 className="font-light">
          Create a new chatbot to assist you in your converstations with your
          customers.
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-2 mt-5"
        >
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Chatbot Name...."
            className="max-w-lg"
            required
          />
          <Button type="submit" disabled={loading || !name}>
            {loading ? "Creating Chatbot..." : "Create Chatbot"}
          </Button>
        </form>

        <p className="text-gray-300 mt-5">Example: Customer Support Chatbot</p>
      </div>
    </div>
  );
};

export default CreateChatBot;
