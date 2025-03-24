import { Client } from "@gradio/client";

export const aiService = {
  // Generate a response from the AI model
  generateResponse: async (messages) => {
    const models = [
      "Qwen/Qwen2-72B-Instruct",
      "Qwen/Qwen1.5-110B-Chat-demo"
    ];
    
    for (const model of models) {
      try {
        const client = await Client.connect(model);
        
        // Get the last user message
        const lastUserMessage = messages[messages.length - 1].content;
        
        // Prepare message history
        const history = messages.slice(0, -1).map(msg => [msg.content, msg.sender]);
        
        const result = await client.predict("/model_chat", {
          query: lastUserMessage,
          history: history,
          system: process.env.VITE_QWEN_PROMPT
        });
        
        console.log(`Raw result from API (${model}):`, result.data);
        
        if (!result || !result.data) {
          throw new Error("Invalid response format from API");
        }
        
        // Extract the model's response
        const aiResponse = result.data[1][result.data[1].length - 1][1];
        
        return aiResponse;
      } catch (error) {
        console.error(`Error generating response with ${model}:`, error);
        
        // If this is the last model in the list, rethrow the error
        if (model === models[models.length - 1]) {
          throw error;
        }
        
        // Otherwise, continue with the next model
        console.log(`Trying next model...`);
      }
    }
  }
};