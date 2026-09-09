import type { CliMode } from "../agent/modes.js";

export const CLI_MODES: CliMode[] = ["agent", "ask", "plan"];

export const MODE_DESCRIPTIONS: Record<CliMode, string> = {
  agent: "Read, edit, and run commands — full agent loop with tools",
  ask: "Read-only exploration — answers without changing files",
  plan: "Explore and propose a plan — no file edits applied",
};

export const SLASH_COMMANDS = [
  { command: "/mode agent|ask|plan", description: "Switch permission mode mid-session" },
  { command: "/help", description: "Show slash commands" },
  { command: "/context", description: "Show context window usage" },
  { command: "/exit", description: "End the chat session" },
] as const;
