import type { SDKUserMessage } from "@anthropic-ai/claude-agent-sdk";

function createUserMessage(content: string): SDKUserMessage {
  return {
    type: "user",
    message: { role: "user", content },
    parent_tool_use_id: null,
  };
}

/**
 * Bridges terminal input to the SDK streaming input AsyncGenerator.
 * @see https://code.claude.com/docs/en/agent-sdk/streaming-vs-single-mode
 */
export class InputQueue {
  private pending: SDKUserMessage[] = [];
  private resolver: ((message: SDKUserMessage | null) => void) | null = null;
  private closed = false;

  push(content: string): void {
    const message = createUserMessage(content);
    if (this.resolver) {
      const resolve = this.resolver;
      this.resolver = null;
      resolve(message);
    } else {
      this.pending.push(message);
    }
  }

  close(): void {
    this.closed = true;
    this.resolver?.(null);
    this.resolver = null;
  }

  private waitForMessage(): Promise<SDKUserMessage | null> {
    if (this.pending.length > 0) {
      return Promise.resolve(this.pending.shift() ?? null);
    }
    if (this.closed) return Promise.resolve(null);

    return new Promise((resolve) => {
      this.resolver = resolve;
    });
  }

  async *generator(): AsyncGenerator<SDKUserMessage> {
    while (!this.closed) {
      const message = await this.waitForMessage();
      if (!message) break;
      yield message;
    }
  }
}
