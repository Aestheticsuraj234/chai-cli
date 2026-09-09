import type { Options, PermissionMode } from "@anthropic-ai/claude-agent-sdk";

export type CliMode = "agent" | "ask" | "plan";

const READ_TOOLS = ["Read", "Glob", "Grep", "WebSearch", "WebFetch"] as const;
const AGENT_TOOLS = ["Read", "Edit", "Write", "Bash", "Glob", "Grep"] as const;
const BLOCKED_WRITE_TOOLS = ["Edit", "Write", "Bash"] as const;

const BASE_OPTIONS = {
    maxTurns: 25,
    maxBudgetUsd: 2.0,
    effort: "medium" as const,
    settingSources: ["project"] as Options["settingSources"],
  };

  export function buildModeOptions(mode: CliMode): Options {
    switch (mode) {
      case "agent":
        return {
          ...BASE_OPTIONS,
          permissionMode: "acceptEdits" satisfies PermissionMode,
          allowedTools: [...AGENT_TOOLS],
        };
      case "ask":
        return {
          ...BASE_OPTIONS,
          permissionMode: "dontAsk" satisfies PermissionMode,
          allowedTools: [...READ_TOOLS],
          disallowedTools: [...BLOCKED_WRITE_TOOLS],
        };
      case "plan":
        return {
          ...BASE_OPTIONS,
          permissionMode: "plan" satisfies PermissionMode,
          allowedTools: [...READ_TOOLS],
          disallowedTools: [...BLOCKED_WRITE_TOOLS],
        };
    }
  }

  export function parseCliMode(value: string): CliMode | null {
    if (value === "agent" || value === "ask" || value === "plan") {
      return value;
    }
    return null;
  }