import React, { useState } from "react";
import { Textarea } from "@fluentui/react-components";
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
        let answer = await gptService.getGPTResponse(newConversation);
        const updatedConversation = [...newConversation, { role: "assistant", content: answer }];
        setIsWaiting(false);
        setMessages(updatedConversation);
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
        {/* <div className="actions">
          <p className="actions-box">
            <Link spacing="spacingHorizontalM" appearance="primary">
              Summarize this email
            </Link>
          </p>
          <p className="actions-box">
            <Link appearance="primary">Generate a response</Link>
          </p>
        </div> */}
        <Textarea
          style={{ width: "100%" }}
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
