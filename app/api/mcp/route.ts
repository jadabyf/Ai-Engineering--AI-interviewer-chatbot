import { NextResponse } from "next/server";

import { handleMcpRequest } from "@/server/mcp/server";
import { McpRequest, McpToolName } from "@/types/mcp";

export async function POST(request: Request) {
  const body = (await request.json()) as McpRequest<McpToolName>;

  if (!body?.tool || !body?.input) {
    return NextResponse.json(
      { ok: false, error: "Invalid MCP request payload" },
      { status: 400 }
    );
  }

  const response = await handleMcpRequest(body);
  const status = response.ok ? 200 : 400;

  return NextResponse.json(response, { status });
}
