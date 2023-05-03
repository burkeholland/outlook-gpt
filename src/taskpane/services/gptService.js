/* eslint-disable no-undef */

const gptService = {
  getGPTResponse: async (prompt, messageBody) => {
    let gptReq = {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: `${prompt}: ${messageBody}` }],
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer ",
      },
      body: JSON.stringify(gptReq),
    });

    const json = await response.json();

    return json["choices"][0]["message"]["content"];
  },
};

export default gptService;
