import React, { useState } from "react";
import { Textarea, Card } from "@fluentui/react-components";
import gptService from "../services/gptService";

const Chat = (props) => {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);

  return (
    <div>
      <div className="bottom">
        <div className="conversation">
          {conversation.map((item, index) => (
            <div className={index % 2 === 1 ? "" : "clearfix"}>
              <Card key={index} tokens={{ padding: 8 }} className={index % 2 === 1 ? "message" : "message user"}>
                <div>{item}</div>
              </Card>
            </div>
          ))}
        </div>
        <Textarea
          style={{ width: "100%" }}
          placeholder="Ask me anything..."
          onKeyDown={}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></Textarea>
      </div>
    </div>
  );
};

export default Chat;
