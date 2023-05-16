import React, { useState } from "react";
import { Textarea, tokens } from "@fluentui/react-components";
import gptService from "../services/gptService";

const Chat = (props) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([{ role: "system", content: props.messageBody }]);
  const [isWaiting, setIsWaiting] = useState(false);

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (message.trim().length > 0) {
        const newConversation = [...messages, { role: "user", content: message }];
        setMessage("");
        setIsWaiting(true);
        setMessages([...messages, { role: "user", content: message }]);

        let answer;
        try {
          answer = await gptService.getGPTResponse(newConversation);
        } catch (error) {
          answer = `${error}`;
        } finally {
          console.log(answer);
          setIsWaiting(false);
          const updatedConversation = [...newConversation, { role: "assistant", content: answer }];
          setMessages(updatedConversation);
        }
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const lastUserMessage = messages
        .slice()
        .reverse()
        .find((item) => item.role === "user");
      if (lastUserMessage) {
        setMessage(lastUserMessage.content);
      }
    }
  };

  return (
    <div>
      <div className="conversation">
        {messages.map((item, index) => {
          return getContent(item, index);
        })}
        {isWaiting && <div class="dot-flashing"></div>}
      </div>
      <div className="bottom">
        <Textarea
          style={{ width: "100%", marginBottom: tokens.spaciingVerticalL }}
          placeholder="Ask me anything..."
          onKeyDown={handleKeyDown}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></Textarea>
      </div>
    </div>
  );

  function getContent(item, index) {
    const className = item.role === "user" ? "message user" : "message assistant";
    if (item.role === "system") {
      return <div></div>;
    } else {
      return (
        <div className="clearfix">
          <div key={index} tokens={{ padding: 8 }} className={className}>
            <div>{item.content}</div>
          </div>
        </div>
      );
    }
  }
};

export default Chat;
