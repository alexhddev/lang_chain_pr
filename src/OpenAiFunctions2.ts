import OpenAI from 'openai'

const openai = new OpenAI();

function helloWorld(appendString: string){
	return `Hello world ${appendString}`
}

async function callChatGtpWithFunctions() {
    const history: OpenAI.Chat.ChatCompletionMessageParam[] = [
        {
            role: "system",
            content: "Perform function requests for the user",
        },
        {
            role: "user",
            content: "Hello, I am a user. I would like to call the hello world function passing the string 'It's about time' to it."
        }
    ];
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo-0613',
        messages: history,
        // function calling
        tools: [{
            type: 'function',
            function: {
                name: 'helloWorld',
                description: 'Prints hello world with the string passed to it',
                parameters: {
                    type: 'object',
                    properties: {
                        appendString: {
                            type: 'string',
                            description: 'The string to append to the hello world message',
                        }
                    },
                    required: ['appendString'],
                }
            }
        }],
        tool_choice: 'auto'
    });

    const wantsToUseFunction = response.choices[0].finish_reason == 'tool_calls';

    let content = ""
    if(wantsToUseFunction) {
        //@ts-ignore
        if(response.choices[0].message.tool_calls[0].function.name == 'helloWorld') {
            //@ts-ignore
            const rawArgument = response.choices[0].message.tool_calls[0].function.arguments;
            const parsedArgument = JSON.parse(rawArgument);
            content = helloWorld(parsedArgument.appendString);
            history.push(response.choices[0].message)
			history.push({
				role: "tool",
                content: content,
                //@ts-ignore
                tool_call_id: response.choices[0].message.tool_calls[0].id

			})
        }
    }

    const step4Response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo-0613',
        messages: history,
    });
    console.log(step4Response.choices[0].message);
    
}

callChatGtpWithFunctions();