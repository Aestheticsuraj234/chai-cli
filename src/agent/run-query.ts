import { query } from "@anthropic-ai/claude-agent-sdk";
import chalk from "chalk";
import { handleMessage, MessageHandlerOptions } from "./message-handler.js";

export async function runQuery(prompt:string, options:MessageHandlerOptions = {} ){
    try {
        const {verbose = false} = options; 
        for await (const message of query({
            prompt,
            options:{
                model:"claude-haiku-4-5",
                maxTurns:5,
                allowedTools:["Read" , "Glob" , "Grep"],
                permissionMode:"acceptEdits"
            }
        })){
            handleMessage(message , { verbose: true } );
        }
    } catch (error) {
        console.error(chalk.red("Error: "), error);
    }
}