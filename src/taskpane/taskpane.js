/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, Office */
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { FluentProvider, Textarea, webLightTheme } from "@fluentui/react-components";
import Summarize from "./tabs/summarize";
import Chat from "./components/Chat";

function MyComponent() {
  const [isRunning, setIsRunning] = useState(false);
  const [gptResponse, setGptResponse] = useState(null);
  const [messageBody, setMessageBody] = useState("");
  const [prompt, setPrompt] = useState(
    "Respond to the following question with a helpful answer. The question may be about VS Code, but it may be a general programming question. Give specific, numbered steps to follow to resolve the issue. If the question appears to be related to a VS Code extension, do not answer the question, but instead encourage the user to open an issue on the GitHub repo for the extension. Give them a direct link to the GitHub repo if you know it. Do not address the user directly in your response. Do not include a greeting or closing."
  );

  useEffect(() => {
    // Get the body asynchronous as text
    var _item = Office.context.mailbox.item;
    var body = _item.body;
    body.getAsync(Office.CoercionType.Text, async (asyncResult) => {
      if (asyncResult.status !== Office.AsyncResultStatus.Succeeded) {
        // write the error to the console
        console.log(asyncResult.error);
      } else {
        let bodyText = asyncResult.value.trim();

        // remove all email addresses from bodyText including the < and >
        bodyText = bodyText.replace(/<[^>]*>/g, "");

        // remove all URLs from bodyText
        bodyText = bodyText.replace(/(https?:\/\/[^\s]+)/g, "");

        // remove all text that says "mailto"
        bodyText = bodyText.replace(/mailto/g, "");

        setMessageBody(bodyText);
      }
    });
  }, []);

  const askGPT = async () => {
    let gptReq = {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: `${prompt}. Here is the email you are replying to: ${messageBody}` }],
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer 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",
      },
      body: JSON.stringify(gptReq),
    });

    const json = await response.json();

    return json["choices"][0]["message"]["content"];
  };

  const run = async () => {
    setIsRunning(true);

    const response = await askGPT();

    addToReply(response);

    setIsRunning(false);
  };

  const addToReply = async (response) => {
    Office.context.mailbox.item.body.setSelectedDataAsync(response, { coercionType: Office.CoercionType.Text });
  };

  return (
    <FluentProvider theme={webLightTheme}>
      <Chat messageBody={messageBody}></Chat>
    </FluentProvider>
    // <Pivot aria-label="Basic Pivot Example">
    //   <PivotItem headerText="Summarize">
    //     <Summarize></Summarize>
    //   </PivotItem>
    //   <PivotItem headerText="Auto Reply">
    //     <Stack>
    //       <h2 class="ms-font-xl">Message text</h2>
    //       <div id="message-body" contenteditable="">
    //         {messageBody}
    //       </div>
    //       <div role="button" id="run" onClick={run} class="ms-welcome__action ms-Button ms-Button--hero ms-font-xl">
    //         {isRunning ? (
    //           <div>
    //             <Spinner label="Thinking..." ariaLive="assertive" labelPosition="left" />
    //           </div>
    //         ) : (
    //           <span v-else class="ms-Button-label">
    //             Get Response
    //           </span>
    //         )}
    //       </div>
    //       {gptResponse && (
    //         <div id="response">
    //           <h2 class="ms-font-xl">Response</h2>
    //           <pre id="gpt-response">{gptResponse}</pre>
    //           <div
    //             id="add-to-reply"
    //             role="button"
    //             onClick={addToReply}
    //             class="ms-welcome__action ms-Button ms-Button--hero ms-font-xl"
    //             v-if="gptResponse !== null"
    //           >
    //             <span class="ms-Button-label">Add to Reply</span>
    //           </div>
    //         </div>
    //       )}
    //     </Stack>
    //   </PivotItem>
    //   <PivotItem headerText="Edit Prompt">
    //     <div id="prompt" contenteditable="">
    //       {prompt}
    //     </div>
    //   </PivotItem>
    //   <PivotItem headerText="Settings">
    //     <Label styles={labelStyles}>Pivot #3</Label>
    //   </PivotItem>
    // </Pivot>
    // <div>
    //   <h2 class="ms-font-xl">Prompt</h2>
    //   <div id="prompt" contenteditable="">{prompt}</div>

    //   <h2 class="ms-font-xl">Message</h2>
    //   <div id="message-body" contenteditable="">{messageBody}</div>

    //   {gptResponse &&
    //     <div id="response">
    //       <h2 class="ms-font-xl">Response</h2>
    //       <pre id="gpt-response">{gptResponse}</pre>
    //       <div id="add-to-reply" role="button" onClick={addToReply}
    //         class="ms-welcome__action ms-Button ms-Button--hero ms-font-xl" v-if="gptResponse !== null">
    //         <span class="ms-Button-label">Add to Reply</span>
    //       </div>
    //     </div>
    //   }

    //   <div role="button" id="run" onClick={run} class="ms-welcome__action ms-Button ms-Button--hero ms-font-xl">
    //     {isRunning ?
    //       <div>
    //         <Spinner label="Thinking..." ariaLive="assertive" labelPosition="left" />
    //       </div>
    //       :
    //       <span v-else class="ms-Button-label">Get Response</span>
    //     }
    //   </div>
    // </div >
  );
}

Office.onReady((info) => {
  if (info.host === Office.HostType.Outlook) {
    ReactDOM.render(React.createElement(MyComponent), document.getElementById("root"));
  }
});
