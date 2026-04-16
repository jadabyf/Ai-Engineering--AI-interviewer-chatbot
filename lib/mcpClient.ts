import { McpRequest, McpResponse, McpToolName } from "@/types/mcp";

export async function callMcpTool<T extends McpToolName>(
  tool: T,
  input: McpRequest<T>["input"]
): Promise<McpResponse<T>> {
  const response = await fetch("/api/mcp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tool, input }),
  });

  const data = (await response.json()) as McpResponse<T>;

  if (!response.ok) {
    return {
      ok: false,
      tool,
      error: data.ok ? "Unknown MCP request failure" : data.error,
    };
  }

  return data;
}
