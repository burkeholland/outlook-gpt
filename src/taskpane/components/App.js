import React, { useState } from "react";
import { FluentProvider, Tab, TabList, webLightTheme } from "@fluentui/react-components";
import Chat from "./Chat";
import Settings from "./Settings";

const App = (props) => {
  const [selectedValue, setSelectedValue] = useState("Chat");

  const handleTabSelect = (e, data) => {
    setSelectedValue(data.value);
  };

  return (
    <div>
      <FluentProvider theme={webLightTheme}>
        <TabList selectedValue={selectedValue} onTabSelect={handleTabSelect}>
          <Tab value="Chat">Chat</Tab>
          <Tab value="Settings">Settings</Tab>
        </TabList>
        <div style={{ display: selectedValue === "Chat" ? "block" : "none" }}>
          <Chat messageBody={props.messageBody} />
        </div>
        <div style={{ display: selectedValue === "Settings" ? "block" : "none" }}>
          <Settings />
        </div>
      </FluentProvider>
    </div>
  );
};

export { App };
