import { Command } from "commander";
import { printBanner } from "./ui/banner.js";
import { requireApiKey } from "./config/env.js";
import chalk from "chalk";
import { runQuery } from "./agent/run-query.js";
import { CliMode, parseCliMode } from "./agent/modes.js";


function parseMode(value: string): CliMode {
    const mode = parseCliMode(value);
    if (!mode) {
      throw new Error(`Invalid mode "${value}". Use agent, ask, or plan.`);
    }
    return mode;
  }
  
export function createCli() {

    const program = new Command()
    .name("cursor-cli")
    .description("Learn the Claude Agent SDK through a Cursor-like CLI")
    .version("0.1.0");

    program
    .command("hello")
    .description("Print a greeting")
    .action(()=>{
        console.log("Hello World");
    });

    program.
    command("wakeup")
    .description("Send a one-shot prompt to the agent")
    .argument("<prompt>", "What to ask Claude")
    .option("-m, --mode <mode>", "agent | ask | plan", "agent")
    .option("-v, --verbose", "Show agent loop message types", false)
    .action(async (prompt: string, opts: { mode: string; verbose: boolean }) => {
        requireApiKey();
        await runQuery(prompt, { mode: parseMode(opts.mode), verbose: opts.verbose });
      });

    program
    .command("banner")
    .description("Show the welcome banner")
    .action(() => {
        printBanner();
    });

    program
		.command("doctor")
		.description("Check environment is ready")
		.action(async () => {

			const { execa } = await import("execa");
			const { stdout } = await execa("node", ["-v"]);
			if (Number(stdout.slice(1)) < 18) {
				throw new Error("Node.js version 18 or higher is required");
			}
			// 2. Check Anthropic API key is set
			const apiKey = requireApiKey();
			if (!apiKey) {
				throw new Error("ANTHROPIC_API_KEY is not set");
			}
			console.log(chalk.green("✅ Node.js is >= 18"));
			console.log(chalk.green("✅ Anthropic API key is set"));
		});

        program
        .command("talk")
        .description("Send one shot prompt to the agent")
        .argument("<prompt>", "The prompt to send to the agent")
        .option("-v, --verbose", "Show verbose output")
        .action(async (prompt:string , opts: {verbose?: boolean})=>{
            requireApiKey();
            await runQuery(prompt, { verbose: opts.verbose });
        })

    program.action(()=>{
        program.help();
    });

    return program;
}