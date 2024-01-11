import OpenAI from 'openai'

const openai = new OpenAI();

const history: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
        role: "system",
        content: "Perform function requests for the user"
    }
];
console.log('Hello from cool chatbot!')
process.stdin.addListener('data', async function (input) {
    let userInput = input.toString().trim();
    history.push({
        role: 'assistant',
        content: userInput
    })
    await createChatCompletion();
});

function helloWorld(appendString: string) {
    return `Hello world ${appendString}`
}

async function createChatCompletion() {
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        temperature: 0,
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
    })

    const wantsToUseFunction = response.choices[0].finish_reason == 'tool_calls';
    if (wantsToUseFunction) {
        let content = '';
        //@ts-ignore
        if(response.choices[0].message.tool_calls[0].function.name == 'helloWorld') {
            console.log(123)
            //@ts-ignore
            const rawArgument = response.choices[0].message.tool_calls[0].function.arguments
            const parsedArgument = JSON.parse(rawArgument);
            content = helloWorld(parsedArgument.appendString);
            history.push(response.choices[0].message)
			history.push({
				role: "function",
				name: "helloWorld", 
                content:content
			})
            console.log(456)
        }

    }



    const responseMessage = response.choices[0].message;
    const messageParam: OpenAI.Chat.ChatCompletionMessageParam = {
        role: responseMessage.role,
        content: responseMessage.content
    }
    history.push(messageParam);
    console.log(`${messageParam.role}: ${messageParam.content}`)
}