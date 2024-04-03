import Toast from "@/components/Toast";
import { createContext, useContext, useEffect, useState } from "react";

export type Message = {
  text: string;
  type: "success" | "error";
};

interface MessageContextType {
  messages: Message[];
  addMessage: (text: Message) => void;
  removeMessage: () => void;
}

const MessageContext = createContext<MessageContextType>({
  messages: [],
  addMessage: () => {},
  removeMessage: () => {},
});

export function useMessage() {
  return useContext(MessageContext);
}

export const MessageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    setTimeout(() => {
      removeMessage();
    }, 3000);
  };

  const removeMessage = () => {
    setMessages((prevMessages) => prevMessages.slice(1));
  };

  return (
    <MessageContext.Provider value={{ messages, addMessage, removeMessage }}>
      {children}
      {messages.length > 0 &&
        messages.map((message, index) => (
          <Toast key={index} message={message.text} type={message.type} />
        ))}
    </MessageContext.Provider>
  );
};
