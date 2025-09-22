exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                models: [
                    {
                        id: "deepseek-chat",
                        name: "DeepSeek Chat",
                        description: "Primary chat model"
                    },
                    {
                        id: "deepseek-coder",
                        name: "DeepSeek Coder",
                        description: "Code generation optimized"
                    }
                ]
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};