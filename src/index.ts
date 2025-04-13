import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create an MCP server
const server = new McpServer({
  name: "Demo",
  version: "1.0.0",
  capabilities: {
    tools: {},
  },
});

// Add an addition tool
server.tool(
  "add",
  "Add two numbers given",
  { a: z.number(), b: z.number() },
  async ({ a, b }) => ({
    content: [{ type: "text", text: `${a + b}` }],
  })
);

// Add a tool to handle multiple numbers addition
server.tool(
  "addMultiple",
  "Add multiple numbers given",
  { numbers: z.array(z.number()) },
  async ({ numbers }) => ({
    content: [
      {
        type: "text",
        text: `${numbers.reduce((sum, num) => sum + num, 0)}`,
      },
    ],
  })
);

try {
  // Start receiving messages on stdin and sending messages on stdout
  const transport = new StdioServerTransport();
  await server.connect(transport);
} catch (error) {
  console.error("Fatal error in connecting server:", error);
  process.exit(1);
}
