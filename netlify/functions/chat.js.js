const axios = require('axios');

exports.handler = async (event) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { messages, max_tokens = 2048 } = JSON.parse(event.body);

        if (!messages || !Array.isArray(messages)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Messages array is required' })
            };
        }

        const response = await axios.post('https://api.deepseek.com/chat/completions', {
            model: "deepseek-chat",
            messages: messages,
            max_tokens: max_tokens,
            temperature: 0.7,
            stream: false
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.sk-54a642f795794ef288caf7993a5df37f}`,
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: response.data.choices[0].message
            })
        };

    } catch (error) {
        console.error('DeepSeek API Error:', error.response?.data || error.message);
        
        let statusCode = 500;
        let errorMessage = 'Internal server error';
        
        if (error.response?.status === 401) {
            statusCode = 401;
            errorMessage = 'Invalid API key';
        } else if (error.response?.status === 429) {
            statusCode = 429;
            errorMessage = 'Rate limit exceeded';
        } else if (error.code === 'ECONNABORTED') {
            statusCode = 408;
            errorMessage = 'Request timeout';
        } else {
            errorMessage = error.message;
        }

        return {
            statusCode: statusCode,
            headers,
            body: JSON.stringify({ error: errorMessage })
        };
    }
};