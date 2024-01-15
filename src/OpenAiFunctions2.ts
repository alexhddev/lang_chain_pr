import OpenAI from 'openai'

const openai = new OpenAI();

function helloWorld(appendString: string) {
    return `Hello world ${appendString}`
}

function getTimeOfDay() {
    return '9:55';
}

function getOrderStatus(orderId: string) {
    console.log(`Getting order status for order id ${orderId}`);
    // check if the orderId as number is odd or even
    const orderIdAsNumber = parseInt(orderId);
    if (orderIdAsNumber % 2 == 0) {
        return 'IN_PROGRESS';
    }
    return 'COMPLETED';
}

function getAvailableFlights(departure: string, destination: string ): string[] {
    if (departure == 'SFO' && destination == 'LAX') {
        return ['UA 123', 'AA 456'];
    }
    if (departure == 'DFW' && destination == 'LAX') {
        return ['AA 789'];
    }
    return ['66 FSFG'];
}

async function callChatGtpWithFunctions() {
    const history: OpenAI.Chat.ChatCompletionMessageParam[] = [
        {
            role: "system",
            content: "You are a helpful assistant that gives information about flights",
        },
        {
            role: "user",
            content: "I would like to know if there are any flights from GHTI to DNHIEC",
        }
    ];
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo-0613',
        messages: history,
        // function calling
        tools: [
            {
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
            },
            {
                type: 'function',
                function: {
                    name: 'getAvailableFlights',
                    description: 'returns the available flights for a given departure, destination and datetime',
                    parameters: {
                        type: 'object',
                        properties: {
                            departure: {
                                type: 'string',
                                description: 'The departure airport code',
                            },
                            destination: {
                                type: 'string',
                                description: 'The destination airport code',
                            }
                        },
                        required: ['departure', 'destination'],
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'getOrderStatus',
                    description: 'Returns the status of an order',
                    parameters: {
                        type: 'object',
                        properties: {
                            orderId: {
                                type: 'string',
                                description: 'the id of the order to get the status of',
                            }
                        },
                        required: ['orderId'],
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'getTimeOfDay',
                    description: 'Get the time of day',
                    parameters: {
                        type: 'object',
                        properties: {}
                    }
                }
            }
        ],
        tool_choice: 'auto' // auto means that the engine will decide which tool to use
    });

    const wantsToUseFunction = response.choices[0].finish_reason == 'tool_calls';


    if (wantsToUseFunction) {
        //@ts-ignore
        if (response.choices[0].message.tool_calls[0].function.name == 'getAvailableFlights') {
            //@ts-ignore
            const rawArgument = response.choices[0].message.tool_calls[0].function.arguments;
            const parsedArguments = JSON.parse(rawArgument);
            let content = getAvailableFlights(parsedArguments.departure, parsedArguments.destination);  
            history.push(response.choices[0].message)
            const chatCompletion = content.map(flight => {
                return {
                    text: flight,
                    type: 'text'
                }

            })
            history.push({
                role: "tool",
                //@ts-ignore
                content: chatCompletion,
                //@ts-ignore
                tool_call_id: response.choices[0].message.tool_calls[0].id

            })
        }
        //@ts-ignore
        if (response.choices[0].message.tool_calls[0].function.name == 'helloWorld') {
            //@ts-ignore
            const rawArgument = response.choices[0].message.tool_calls[0].function.arguments;
            const parsedArgument = JSON.parse(rawArgument);
            let content = helloWorld(parsedArgument.appendString);
            history.push(response.choices[0].message)
            history.push({
                role: "tool",
                content: content,
                //@ts-ignore
                tool_call_id: response.choices[0].message.tool_calls[0].id

            })
        }
        //@ts-ignore
        if (response.choices[0].message.tool_calls[0].function.name == 'getOrderStatus') {
            //@ts-ignore
            const rawArgument = response.choices[0].message.tool_calls[0].function.arguments;
            const parsedArgument = JSON.parse(rawArgument);
            let content = getOrderStatus(parsedArgument.orderId);
            history.push(response.choices[0].message)
            history.push({
                role: "tool",
                content: content,
                //@ts-ignore
                tool_call_id: response.choices[0].message.tool_calls[0].id

            })
        }
        //@ts-ignore
        if (response.choices[0].message.tool_calls[0].function.name == 'getTimeOfDay') {

            let content = getTimeOfDay();
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