// A React component to allow the user to store their settings
import { Field, Input, Button, tokens } from "@fluentui/react-components";
import React, { useState } from "react";

const Settings = () => {
  const [apiKey, setApiKey] = useState(window.API_KEY);

  const handleSaveClick = () => {
    // save the API key to Outlook roaming settings
    Office.context.roamingSettings.set("openAIKey", apiKey);
    Office.context.roamingSettings.saveAsync();

    // EEK!
    window.API_KEY = apiKey;
  };

  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
  };

  return (
    <div class="settings">
      <Field
        style={{ marginBottom: tokens.spacingHorizontalL }}
        size="large"
        label="OpenAPI Key"
        validationState="success"
        validationMessage="Please input your OpenAPI Key"
      >
        <Input value={apiKey} onChange={handleApiKeyChange} />
      </Field>
      <div class="is-pulled-right">
        <Button onClick={handleSaveClick}>Save</Button>
      </div>
    </div>
  );
};

export default Settings;
