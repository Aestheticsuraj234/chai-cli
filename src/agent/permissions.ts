import { confirm } from "@inquirer/prompts";
import type { CanUseTool } from "@anthropic-ai/claude-agent-sdk";


export const promptBeforeToolUse: CanUseTool = async (toolName, input) => {
    const preview = JSON.stringify(input, null, 2).slice(0, 300);
    const approved = await confirm({
      message: `Allow tool "${toolName}"?\n${preview}`,
      default: false,
    });
  
    if (approved) {
      return { behavior: "allow", updatedInput: input };
    }
    return { behavior: "deny", message: "User denied tool use" };
  };