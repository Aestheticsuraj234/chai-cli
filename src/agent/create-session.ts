import { query, type Query } from "@anthropic-ai/claude-agent-sdk";
import { buildModeOptions, type CliMode } from "./modes.js";
import { InputQueue } from "./input-queue.js";

export type AgentSession = {
  query: Query;
  inputQueue: InputQueue;
  mode: CliMode;
};

/**
 * Creates a streaming-input agent session.
 * The Query handle exposes setPermissionMode() for mid-session mode switches.
 */
export function createSession(mode: CliMode): AgentSession {
  const inputQueue = new InputQueue();
  const agentQuery = query({
    prompt: inputQueue.generator(),
    options: buildModeOptions(mode),
  });

  return { query: agentQuery, inputQueue, mode };
}
