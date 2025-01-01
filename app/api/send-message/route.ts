import { INSERT_MESSAGE } from "@/graphql/mutation/mutations";
import {
  GET_CHATBOT_BY_ID,
  GET_MESSAGES_BY_CHAT_SESSION_ID,
} from "@/graphql/query/queries";
import serverClient from "@/lib/server/serverClient";
import {
  GetChatbotByIdResponse,
  MessagesByChatSessionIdResponse,
} from "@/types/types";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  const { name, content, chatbot_id, chat_session_id } = await request.json();

  console.log("Request >>", { name, content, chatbot_id, chat_session_id });

  try {
    // step 1: Fetch Chatbot Characteristics
    const { data } = await serverClient.query<GetChatbotByIdResponse>({
      query: GET_CHATBOT_BY_ID,
      variables: {
        id: chatbot_id,
      },
    });

    const chatbot = data.chatbots;
    if (!chatbot) {
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 });
    }

    // step 2: Fetch previous messages
    const { data: messagesData } =
      await serverClient.query<MessagesByChatSessionIdResponse>({
        query: GET_MESSAGES_BY_CHAT_SESSION_ID,
        variables: {
          chat_session_id,
        },
        fetchPolicy: "no-cache",
      });

    const previousMessages = messagesData.chat_sessions.messages;

    const formattedPreviousMessages: ChatCompletionMessageParam[] =
      previousMessages.map((message) => ({
        role: message.sender === "ai" ? "system" : "user",
        name: message.sender === "ai" ? "system" : name,
        content: message.content,
      }));

    // Combine Chatbot Characteristics and Previous Messages into a system prompt
    const systemPrompt = chatbot.chatbot_characteristics
      .map((c) => c.content)
      .join(" + ");

    console.log("System Prompt >>", systemPrompt);

    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        name: "system",
        content: `You are a helpful assistant talking to ${name}. If a generic question is asked which is not relevant or in the same scope or domain as the points in mentioned in the key information section, kindly inform the user they are only allowed to search for the specific information mentioned in the key information section. Use Emoji's where it is possible to make the conversation more engaging. Here is some key information that you need to be aware of, those are elements you may be asked about: ${systemPrompt}`,
      },
      ...formattedPreviousMessages,
      {
        role: "user",
        name,
        content,
      },
    ];

    // step 3: Send message to OpenAI

    const openaiResponse = await openai.chat.completions.create({
      messages,
      model: "gpt-4o",
    });

    console.log("OpenAI Response >>", openaiResponse);

    const aiResponse = openaiResponse?.choices?.[0]?.message?.content?.trim();

    if (!aiResponse) {
      return NextResponse.json(
        { error: "Failed to get AI response" },
        { status: 500 }
      );
    }

    console.log("AI Response >>", aiResponse);

    // step 4: Insert AI response to database
    await serverClient.mutate({
      mutation: INSERT_MESSAGE,
      variables: {
        chat_session_id,
        sender: "user",
        content,
        created_at: new Date().toISOString(),
      },
    });

    // step 5: Save AI response to database
    const aiMessageResult = await serverClient.mutate({
      mutation: INSERT_MESSAGE,
      variables: {
        chat_session_id,
        sender: "ai",
        content: aiResponse,
        created_at: new Date().toISOString(),
      },
    });

    console.log("AI Message Result >>", aiMessageResult);

    // step 6: Return AI response
    return NextResponse.json({
      id: aiMessageResult.data.insertMessages.id,
      content: aiResponse,
    });
  } catch (error) {
    console.error("Failed to send message", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
