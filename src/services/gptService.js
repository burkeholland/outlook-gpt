/* eslint-disable no-undef */

// Try to retreive the open AI key from RoamingSettings
// If it doesn't exist, use the default key

const gptService = {
  // Function 1
  getGPTResponse: async (messages, key) => {
    let gptReq = {
      model: "gpt-3.5-turbo",
      messages: messages,
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${window.API_KEY}`,
      },
      body: JSON.stringify(gptReq),
    });

    const json = await response.json();

    if (json.error) {
      throw new Error(json.error.code);
    }

    return json["choices"][0]["message"]["content"];
  },
};

export default gptService;
