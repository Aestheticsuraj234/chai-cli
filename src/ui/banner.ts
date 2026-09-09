import chalk from "chalk";
import boxen from "boxen";
import figlet from "figlet";


export function printBanner(){
    const title = figlet.textSync("chai-cli" , {font:"Standard"});
    const panel = boxen(
        chalk.cyan("Learn the Claude Agent SDK\n") +
          chalk.dim("Full Production Ready"),
        { padding: 1, borderColor: "cyan" }
      );

      console.log(title);
      console.log(panel);
}