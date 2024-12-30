"use client";
import { REMOVE_CHARACTERISTIC } from "@/graphql/mutation/mutations";
import { ChatbotCharacteristic } from "@/types/types";
import { useMutation } from "@apollo/client";
import { OctagonX } from "lucide-react";
import { toast } from "sonner";

const Characteristic = ({
  characteristic,
}: {
  characteristic: ChatbotCharacteristic;
}) => {
  const [removeCharacteristic] = useMutation(REMOVE_CHARACTERISTIC, {
    refetchQueries: ["GetChatbotById"],
  });

  const handleRemoveCharacteristic = async () => {
    try {
      await removeCharacteristic({
        variables: {
          id: characteristic.id,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <li
      key={characteristic.id}
      className="relative p-10 bg-white border rounded-md"
    >
      {characteristic.content}
      <OctagonX
        className="w-6 h-6 text-white fill-red-500 absolute top- right-1 cursor-pointer hover:opacity-50"
        onClick={() => {
          const promise = handleRemoveCharacteristic();
          toast.promise(promise, {
            loading: "Removing characteristic ...",
            success: "Characteristic removed Successfully...",
            error: "Failed to remove characteristic...",
          });
        }}
      />
    </li>
  );
};

export default Characteristic;
