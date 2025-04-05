document.getElementById('aiBtn').addEventListener('click', function() {
    document.getElementById('options').style.display = 'none';
    document.getElementById('chatbot').classList.remove('hidden');
});

document.getElementById('closeChatBtn').addEventListener('click', function() {
    document.getElementById('chatbot').classList.add('hidden');
    document.getElementById('options').style.display = 'grid';
});

document.getElementById('communityBtn').addEventListener('click', function() {
    window.location.href = 'community.html'; 
});

document.getElementById('challengeBtn').addEventListener('click', function() {
    window.location.href = 'Challenge/rutine.html'; 
});

document.getElementById('educationBtn').addEventListener('click', function() {
    window.location.href = 'education.html'; 
});

document.getElementById('sendBtn').addEventListener('click', function() {
    const messageInput = document.getElementById('message');
    const messageText = messageInput.value.trim();
    if (messageText) {
        addMessage(messageText, 'user-message');
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
    const prompt = `User: ${userInput}\nAI: `;
    
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
            addMessage(data, 'ai-message');
        })
        .catch(error => {
            addMessage('Sorry, there was an error processing your request. Please try again.', 'ai-message');
        });
}
