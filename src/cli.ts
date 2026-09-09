import { Command } from "commander";
import { printBanner } from "./ui/banner.js";
import { requireApiKey } from "./config/env.js";
import chalk from "chalk";

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

    program.action(()=>{
        program.help();
    });

    return program;
}