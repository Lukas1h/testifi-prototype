import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { OpenAI } from "openai";
import SendIcon from "@/assets/send icon.png";

const openai = new OpenAI({
  apiKey: "prototype",
  baseURL: "https://testimony.quickcache.org/api/v1",
  dangerouslyAllowBrowser: true,
});

export default function ChatInterface() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    [
      {
        role: "system",
        content: `Hello, I'd like you to ask me a progression of questions with the goal of "drawing out" my personal story of how I met God. I'd like the end product to be about 450 words. Don't ask a bunch of questions at once, just one at a time. Also, after the first version ask me what tone I'd prefer. If I don't include any scripture verses, ask me which verses were important to my story. The goal is to have a well written, concise, and compelling story.`,
      },
      {
        role: "assistant",
        content:
          "Can you tell me about a moment in your life when you first started thinking about God or feeling like something was missing?",
      },
    ]
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { role: "user", content: input };
    const messagesPayload = [
      ...messages,
      newMessage,
      { role: "assistant", content: "" },
    ];

    setMessages(messagesPayload);
    setInput("");
    setLoading(true);

    const stream = await openai.chat.completions.create({
      model: "grok-beta",
      messages: messagesPayload,
      stream: true,
    });

    let responseMessageContent = "";
    for await (const chunk of stream) {
      responseMessageContent += chunk.choices[0]?.delta?.content || "";
      let responseMessage = {
        role: "assistant",
        content: responseMessageContent,
      };
      let messages = messagesPayload.slice(0, -1).concat(responseMessage);
      setMessages(messages);
    }
    setLoading(false);
  };

  return (
    <div className="bg-logo max-w-2xl mx-auto">
      <div className="max-w-2xl mx-auto p-4 space-y-4 h-screen overflow-clip overflow-y-scroll flex flex-col ">
        <div className="p-4 space-y-8 flex flex-col w-full pb-[100px]">
          {messages
            .filter((msg) => msg.content.trim() !== "" && msg.role !== "system")
            .map((msg, index) => (
              <div
                key={index}
                className={
                  "p-4 max-w-[80%] break-words bg-accent text-dark rounded-3xl shadow " +
                  (msg.role === "user"
                    ? "self-end rounded-tr-none"
                    : " self-start rounded-tl-none")
                }
              >
                {msg.content}
              </div>
            ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="fixed bottom-0 w-full max-w-2xl mx-auto p-4">
        <div className="flex gap-2 rounded-full shadow bg-dark p-2 justify-between items-center">
          <Input
            value={input}
            className="border-none flex-1 font-medium text-[16px]"
            onChange={(e) => setInput(e.target.value)}
            placeholder="I first started..."
          />
          <button onClick={sendMessage} disabled={loading}>
            <img src={SendIcon} alt="" height={40} width={40} />
          </button>
        </div>
      </div>
    </div>
  );
}
