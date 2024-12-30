import { gql } from "@apollo/client";

export const CREATE_CHATBOT = gql`
  mutation CreateChatBot(
    $clerk_user_id: String!
    $name: String!
    $created_at: DateTime!
  ) {
    insertChatbots(
      clerk_user_id: $clerk_user_id
      name: $name
      created_at: $created_at
    ) {
      id
      name
      created_at
    }
  }
`;

export const REMOVE_CHARACTERISTIC = gql`
  mutation RemoveCharacteristic($id: Int!) {
    deleteChatbotCharacteristics(id: $id) {
      id
    }
  }
`;

export const DELETE_CHATBOT = gql`
  mutation DeleteChatBot($id: Int!) {
    deleteChatbots(id: $id) {
      id
    }
  }
`;
