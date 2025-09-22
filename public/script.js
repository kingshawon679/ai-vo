class DeepSeekChatbot {
    constructor() {
        // Netlify functions automatically serve at /api/* path
        this.apiBaseUrl = ''; // Same domain e thakbe
        this.messages = [];
        this.isLoading = false;
        
        this.initializeElements();
        this.attachEventListeners();
        this.loadTheme();
    }

    // ... previous code same ...

    async callDeepSeekAPI(userMessage) {
        this.messages.push({ role: 'user', content: userMessage });

        // Netlify function call - relative path use korbo
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: this.messages,
                max_tokens: 2048
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
            this.messages.push(data.message);
            return data.message.content;
        } else {
            throw new Error(data.error || 'Unknown error occurred');
        }
    }

    // ... rest of the code same ...
}