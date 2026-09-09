import type { SDKMessage } from "@anthropic-ai/claude-agent-sdk";
import { fmt, truncate } from "../ui/format.js";
import { stopSpinner } from "../ui/spinner.js";

export type MessageHandlerOptions = {
    verbose?: boolean;
  };

  function contentToString(content: unknown): string {
    if (typeof content === "string") return content;
    if (!Array.isArray(content)) return String(content ?? "");
  
    return content
      .map((block) => {
        if (typeof block !== "object" || block === null) return "";
        const b = block as Record<string, unknown>;
        if (b.type === "text" && typeof b.text === "string") return b.text;
        if (b.type === "tool_use" && typeof b.name === "string") return `[tool: ${b.name}]`;
        return "";
      })
      .filter(Boolean)
      .join("\n");
  }

  function extractToolNames(content: unknown): string[] {
    if (!Array.isArray(content)) return [];
    return content
      .filter(
        (block): block is { type: "tool_use"; name: string } =>
          typeof block === "object" &&
          block !== null &&
          (block as { type?: string }).type === "tool_use" &&
          typeof (block as { name?: string }).name === "string"
      )
      .map((block) => block.name);
  }

  export function handleMessage(message: SDKMessage, options: MessageHandlerOptions = {}){
    const { verbose = false } = options;

    if(verbose){
        console.log(fmt.dim(`[${message.type}]`));
    }

    switch(message.type){
        case "system": {
            if (message.subtype === "init") {
                console.log(
                  fmt.system(
                    `Session started · model: ${message.model} · id: ${message.session_id.slice(0, 8)}…`
                  )
                );
              } else if (message.subtype === "compact_boundary") {
                console.log(fmt.system("Context compacted — older history summarized"));
              }
              break;
        }
        
        case "assistant":{
            const content = message.message.content;
      const text = contentToString(content);
      const tools = extractToolNames(content);

      if (text.trim()) {
        console.log(fmt.assistant(text.trim()));
      }

      for (const tool of tools) {
        console.log(fmt.tool(`  → ${tool}`));
      }
      break;
        }

        case "user":{
            if (message.parent_tool_use_id) {
                const result = contentToString(message.message.content);
                if (result.trim()) {
                  console.log(fmt.toolResult(`  ← ${truncate(result.trim(), 120)}`));
                }
              }
              break;
        }

        case "stream_event":{
            if(verbose){
                console.log(fmt.dim("(streaming…)"));
            }
            break;
        }


        case "result":{
            stopSpinner();

            if (message.subtype === "success") {
                if (message.result?.trim()) {
                  console.log(fmt.success("\n" + message.result.trim()));
                }
                console.log(
                  fmt.dim(
                    `Done · ${message.num_turns} turns · $${message.total_cost_usd.toFixed(4)}`
                  )
                );
              } else {
                console.log(fmt.error(`Stopped: ${message.subtype}`));
                console.log(
                  fmt.dim(
                    `${message.num_turns} turns · $${message.total_cost_usd.toFixed(4)}`
                  )
                );
              };
              break;
        }

        default: 
            break;
        
        
        
    }
  }