document.getElementById('aiBtn').addEventListener('click', function() {
    document.getElementById('options').style.display = 'none';
    document.getElementById('chatbot').classList.remove('hidden');
});

document.getElementById('closeChatBtn').addEventListener('click', function() {
    document.getElementById('chatbot').classList.add('hidden');
    document.getElementById('options').style.display = 'grid'; // Re-display the options
});

document.getElementById('discussBtn').addEventListener('click', function() {
    window.location.href = 'discuss.html'; 
});

document.getElementById('challengeBtn').addEventListener('click', function() {
    window.location.href = 'challenge.html'; 
});

document.getElementById('educationBtn').addEventListener('click', function() {
    window.location.href = 'education.html'; 
});

document.getElementById('sendBtn').addEventListener('click', function() {
    const messageInput = document.getElementById('message');
    const messageText = messageInput.value.trim();
    if (messageText) {
        addMessage(messageText, 'user-message');  // Removed "You: " prefix
        messageInput.value = '';
        fetchResponseFromAPI(messageText);
    }
});

document.getElementById('message').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        document.getElementById('sendBtn').click();
    }
});

function addMessage(text, className) {
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.textContent = text;
    messageElement.className = `message ${className}`; 
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; 
}

function fetchResponseFromAPI(userInput) {
    const baseURL = 'https://text.pollinations.ai/';
    const url = baseURL + encodeURIComponent(userInput);

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            addMessage(data, 'ai-message'); // Removed "Chatbot: " prefix
        })
        .catch(error => {
            addMessage('Sorry, there was an error processing your request. Please try again.', 'ai-message'); // Adjusted for no prefix
        });
}