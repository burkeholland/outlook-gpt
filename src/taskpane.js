/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, Office */
import React from "react";
import ReactDOM from "react-dom";
import { App } from "./components/App";

Office.onReady((info) => {
  if (info.host === Office.HostType.Outlook) {
    // Get the body asynchronous as text
    var _item = Office.context.mailbox.item;
    var body = _item.body;
    body.getAsync(Office.CoercionType.Text, async (asyncResult) => {
      if (asyncResult.status !== Office.AsyncResultStatus.Succeeded) {
        // write the error to the console
        console.log(asyncResult.error);
      } else {
        let bodyText = asyncResult.value.trim();

        // truncate the bodyText to 2000 characters
        bodyText = bodyText.substring(0, 2000);

        // remove all email addresses from bodyText including the < and >
        bodyText = bodyText.replace(/<[^>]*>/g, "");

        // remove all URLs from bodyText
        bodyText = bodyText.replace(/(https?:\/\/[^\s]+)/g, "");

        // remove all text that says "mailto"
        bodyText = bodyText.replace(/mailto/g, "");

        // read the API key from roaming settings
        window.API_KEY = Office.context.roamingSettings.get("openAIKey");

        // render mycomponent passing messagebody as a prop
        ReactDOM.render(<App messageBody={bodyText} />, document.getElementById("root"));
      }
    });
  }
});
