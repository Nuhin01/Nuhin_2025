// ... (Previous code for UI interactions remains the same until fetchResponseFromAPI)

// Modified function to analyze English sentences and format response
function fetchResponseFromAPI(userInput) {
    const prompt = `Analyze the following English text: "${userInput}". Provide a structured response with:
    1. A heading for the analysis
    2. Sentence count
    3. Word count
    4. Average sentence length
    5. Complex words (words with 3+ syllables)
    6. Sentiment analysis (positive/negative/neutral)
    Format the response using HTML tags for headings (<h3>), bold text (<strong>), and lists (<ul><li>).`;

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
            const formattedResponse = formatAIResponse(data);
            addMessage(formattedResponse, 'ai-message');
        })
        .catch(error => {
            addMessage('Sorry, there was an error processing your request. Please try again.', 'ai-message');
        });
}

// New function to format raw AI response
function formatAIResponse(rawResponse) {
    // Basic cleaning of raw response
    let cleanedResponse = rawResponse.trim();
    
    // If the API doesn't return formatted text, create a structured response
    if (!cleanedResponse.includes('<h3>')) {
        // Analyze the input ourselves if API doesn't provide structured response
        const analysis = analyzeText(cleanedResponse);
        return `
            <h3>Text Analysis Results</h3>
            <ul>
                <li><strong>Sentence Count:</strong> ${analysis.sentenceCount}</li>
                <li><strong>Word Count:</strong> ${analysis.wordCount}</li>
                <li><strong>Average Sentence Length:</strong> ${analysis.avgSentenceLength.toFixed(2)} words</li>
                <li><strong>Complex Words:</strong> ${analysis.complexWords.join(', ') || 'None'}</li>
                <li><strong>Sentiment:</strong> ${analysis.sentiment}</li>
            </ul>
        `;
    }
    return cleanedResponse; // Return API's formatted response if available
}

// New function to analyze text when API response isn't formatted
function analyzeText(text) {
    // Split into sentences
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const sentenceCount = sentences.length;

    // Count words
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;

    // Calculate average sentence length
    const avgSentenceLength = wordCount / sentenceCount;

    // Identify complex words (3+ syllables approximation)
 complexWords = words.filter(word => {
    // Simple syllable counter (counts vowel groups)
    const syllableCount = (word.match(/[aeiouy]+/gi) || []).length;
    return syllableCount >= 3;
});

    // Basic sentiment analysis
    const positiveWords = ['good', 'great', 'happy', 'excellent', 'wonderful'];
    const negativeWords = ['bad', 'terrible', 'sad', 'horrible', 'awful'];
    let sentimentScore = 0;
    
    words.forEach(word => {
        word = word.toLowerCase();
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
    messageElement.innerHTML = text; // Changed from textContent to innerHTML to render HTML
    messageElement.className = `message ${className}`;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// ... (Rest of the original code for community posts remains unchanged)
