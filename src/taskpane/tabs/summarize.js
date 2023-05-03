import React, { useState } from "react";
import { Spinner, Button } from "@fluentui/react-components";
import gptService from "../services/gptService";

function Summarize(props) {
  const [summarization, setSummarization] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const handleSummarizeThread = async () => {
    setIsRunning(true);
    const response = await gptService.getGPTResponse(
      "Summarize this email with a short, 1 sentence summary. Follow that with 3 bullet points that contain the highlights of the email.",
      props.messageBody
    );

    setSummarization(response);
    setIsRunning(false);
  };

  return (
    <div>
      <div>{summarization}</div>
      <div className="bottom">
        {!isRunning && (
          <Button appearance="primary" onClick={handleSummarizeThread}>
            Summarize
          </Button>
        )}
        {isRunning && <Spinner size="large" label="Thinking..." ariaLive="assertive" labelPosition="before" />}w
      </div>
    </div>
  );
}

export default Summarize;
