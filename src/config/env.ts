import chalk from "chalk";
import "dotenv/config";
import { execa } from "execa";

export function requireApiKey(): string {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error(
      "Missing ANTHROPIC_API_KEY. Copy .env.example to .env and add your key."
    );
  }
  return key;
}


export async function checkEnvironment(): Promise<void> {
  const { stdout } = await execa("node", ["-v"]);
  const major = parseInt(stdout.trim().replace(/^v/, "").split(".")[0] ?? "0", 10);

  if (major < 18) {
    throw new Error(`Node.js 18+ required (found ${stdout.trim()})`);
  }

  requireApiKey();
  console.log(chalk.green("✓ Node.js is >= 18"));
  console.log(chalk.green("✓ ANTHROPIC_API_KEY is set"));
}