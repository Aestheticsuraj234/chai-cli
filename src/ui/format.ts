import chalk from "chalk";

export const fmt = {
  system: (text: string) => chalk.gray(text),
  assistant: (text: string) => chalk.cyan(text),
  tool: (text: string) => chalk.yellow(text),
  toolResult: (text: string) => chalk.dim.green(text),
  success: (text: string) => chalk.green(text),
  error: (text: string) => chalk.red(text),
  dim: (text: string) => chalk.dim(text),
  label: (text: string) => chalk.bold.white(text),
  mode: (text: string) => chalk.magenta(text),
};

export function truncate(text: string, max = 200): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}…`;
}
