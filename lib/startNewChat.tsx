import client from "@/graphql/ApolloClient";
import {
  INSERT_CHAT_SESSION,
  INSERT_GUEST,
  INSERT_MESSAGE,
} from "@/graphql/mutation/mutations";

async function startNewChat(
  guestName: string,
  guestEmail: string,
  chatbotId: number
) {
  try {
    // 1. create a new guest entry
    const guestResult = await client.mutate({
      mutation: INSERT_GUEST,
      variables: {
        name: guestName,
        email: guestEmail,
        created_at: new Date().toISOString(),
      },
    });
    console.log("Guest created successfully");
    console.log("Guest result >>", guestResult);
    const guestId = guestResult.data.insertGuests.id;

    // 2. create a new chat session
    const chatSessionResult = await client.mutate({
      mutation: INSERT_CHAT_SESSION,
      variables: {
        chatbot_id: chatbotId,
        guest_id: guestId,
        created_at: new Date().toISOString(),
      },
    });

    console.log("Chat session created successfully");
    console.log("Chat session result >>", chatSessionResult);

    const chatSessionId = chatSessionResult.data.insertChat_sessions.id;

    // Insert initial message
    const result = await client.mutate({
      mutation: INSERT_MESSAGE,
      variables: {
        chat_session_id: chatSessionId,
        sender: "ai",
        content: `Hello ${guestName}! 😊\n I am Assistly, your AI chat agent. How can I help you today?`,
        created_at: new Date().toISOString(),
      },
    });

    console.log("New chat started successfully");
    console.log("Message result >>", result);
    return chatSessionId;
  } catch (error) {
    console.log("Failed to start new chat: ", error);
  }
}

export { startNewChat };
