import { inngest } from "./client";
import { createAgent, gemini } from "@inngest/agent-kit";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event }) => {
    const codeAgent = createAgent({
      name: "code-agent",
      system:
        "You are an expert nextjs developer. you can write readable maintainable code, you can create simple nextjs snippet",
      model: gemini({ model: "gemini-2.5-flash" }),
    });
    const { output } = await codeAgent.run(event.data.value);
    return { message: output };
  }
);
