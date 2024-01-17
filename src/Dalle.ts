import OpenAI from 'openai'

const openai = new OpenAI();

async function execute() {
    const response = await openai.images.generate({
        model: 'dall-e-2',
        prompt: 'a programmer dog in the park with a laptop, a coffe and a desk',

    })
    console.log(response.data)
}

execute();