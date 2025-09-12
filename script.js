// ... (Previous code for UI interactions remains the same until fetchResponseFromAPI)

// Modified function to fetch and process English sentence analysis
function fetchResponseFromAPI(userInput) {
    const prompt = `Analyze the following English text: "${userInput}". Provide a concise response formatted in HTML with:
    <h3>Text Analysis</h3>
    <ul>
        <li><strong>Sentence Count:</strong> [Number of sentences]</li>
        <li><strong>Word Count:</strong> [Total words]</li>
        <li><strong>Average Sentence Length:</strong> [Average words per sentence, rounded to 2 decimals]</li>
        <li><strong>Complex Words:</strong> [Words with 3+ syllables, comma-separated, or "None" if none]</li>
        <li><strong>Sentiment:</strong> [Positive, Negative, or Neutral]</li>
    </ul>
    Do not include symbols like "---", excessive headings, or clause-by-clause breakdowns. Keep the response clear and concise.`;

    const baseURL = 'https://text.pollinations.ai/';
    const url = baseURL + encodeURIComponent(prompt);

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            // Process raw API response to ensure proper formatting
            const formattedResponse = formatAIResponse(data, userInput);
            addMessage(formattedResponse, 'ai-message');
        })
        .catch(error => {
            addMessage('Sorry, there was an error processing your request. Please try again.', 'ai-message');
        });
}

// Enhanced function to format raw AI response
function formatAIResponse(rawResponse, userInput) {
    // Clean raw response: remove unwanted symbols and normalize whitespace
    let cleanedResponse = rawResponse
        .replace(/[-]{2,}/g, '') // Remove "---" or similar symbols
        .replace(/\n+/g, ' ') // Replace multiple newlines with single space
        .replace(/\s+/g, ' ') // Normalize multiple spaces
        .trim();

    // Check if response contains expected HTML structure
    if (cleanedResponse.includes('<h3>Text Analysis</h3>') && cleanedResponse.includes('<ul>')) {
        return cleanedResponse; // Return API response if properly formatted
    }

    // If API response is not properly formatted, use fallback analysis
    const analysis = analyzeText(userInput);
    return `
        <h3>Text Analysis</h3>
        <ul>
            <li><strong>Sentence Count:</strong> ${analysis.sentenceCount}</li>
            <li><strong>Word Count:</strong> ${analysis.wordCount}</li>
            <li><strong>Average Sentence Length:</strong> ${analysis.avgSentenceLength.toFixed(2)} words</li>
            <li><strong>Complex Words:</strong> ${analysis.complexWords.length > 0 ? analysis.complexWords.join(', ') : 'None'}</li>
            <li><strong>Sentiment:</strong> ${analysis.sentiment}</li>
        </ul>
    `;
}

// Improved function to analyze text as a fallback
function analyzeText(text) {
    // Split into sentences (using period, question mark, or exclamation point)
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const sentenceCount = sentences.length;

    // Count words (split by whitespace, filter out empty strings)
    const words = text.split(/\s+/).filter(word => word.match(/\w/));
    const wordCount = words.length;

    // Calculate average sentence length
    const avgSentenceLength = sentenceCount > 0 ? wordCount / sentenceCount : 0;

    // Identify complex words (approximating 3+ syllables by vowel groups)
    const complexWords = words.filter(word => {
        const syllableCount = (word.toLowerCase().match(/[aeiouy]+/gi) || []).length;
        return syllableCount >= 3 && word.length > 6; // Added length check for better accuracy
    });

    // Basic sentiment analysis
    const positiveWords = ['good', 'great', 'happy', 'excellent', 'wonderful', 'secure', 'sanctuary'];
    const negativeWords = ['bad', 'terrible', 'sad', 'horrible', 'awful', 'intrusion', 'specter'];
    let sentimentScore = 0;

    words.forEach(word => {
        word = word.toLowerCase().replace(/[^a-z]/g, ''); // Clean word for comparison
        if (positiveWords.includes(word)) sentimentScore++;
        if (negativeWords.includes(word)) sentimentScore--;
    });

    const sentiment = sentimentScore > 0 ? 'Positive' : 
                     sentimentScore < 0 ? 'Negative' : 'Neutral';

    return {
        sentenceCount,
        wordCount,
        avgSentenceLength,
        complexWords,
        sentiment
    };
}

// Modified addMessage to handle HTML content
function addMessage(text, className) {
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.innerHTML = text; // Use innerHTML to render HTML
    messageElement.className = `message ${className}`;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// ... (Rest of the original code for community posts remains unchanged)
