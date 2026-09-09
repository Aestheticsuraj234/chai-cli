import ora, { type Ora } from "ora";

let active: Ora | null = null;

export function startSpinner(text: string): void {
  stopSpinner();
  active = ora({ text, color: "cyan" }).start();
}

export function updateSpinner(text: string): void {
  if (active) active.text = text;
}

export function stopSpinner(): void {
  active?.stop();
  active = null;
}
