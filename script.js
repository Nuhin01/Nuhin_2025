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
    window.location.href = 'challenge.html'; 
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
document.getElementById('post-button').addEventListener('click', function() {
    const postInput = document.getElementById('post-input');
    const postContent = postInput.value;
    const imageInput = document.getElementById('image-input');
    const imageFile = imageInput.files[0];

    const reader = new FileReader();
    const postList = document.getElementById('post-list');

    if (postContent || imageFile) {
        const newPost = document.createElement('div');
        newPost.classList.add('post');

        const ipAddress = "192.0.2.1"; // Example IP address
        const username = generateUsernameFromIP(ipAddress);
        const date = new Date().toLocaleString(); // Get current date

        const postHTML = `
            <p><strong class="username">${username}</strong> <span class="date">(${date})</span></p>
            <p class="post-content">${postContent}</p>
            ${imageFile ? '<img class="post-image" src="" alt="Post Image">' : ''}
            <button class="like-button">Like</button> <span class="like-count">0</span>
            <button class="comment-button">Comment</button>
            <div class="comments-section" style="display: none;">
                <input type="text" class="comment-input" placeholder="Add a comment...">
                <button class="comment-submit-button">Comment</button>
                <div class="comment-list"></div>
            </div>
        `;

        newPost.innerHTML = postHTML;

        // Image handling
        if (imageFile) {
            reader.onload = function(event) {
                newPost.querySelector('.post-image').src = event.target.result;
            };
            reader.readAsDataURL(imageFile);
        }

        // Add event listeners for like functionality
        const likeButton = newPost.querySelector('.like-button');
        const likeCount = newPost.querySelector('.like-count');
        likeButton.addEventListener('click', function() {
            let currentLikes = parseInt(likeCount.textContent);
            likeCount.textContent = currentLikes + 1;
        });

        // Comment functionality
        const commentButton = newPost.querySelector('.comment-button');
        const commentsSection = newPost.querySelector('.comments-section');
        const commentInput = newPost.querySelector('.comment-input');
        const commentSubmitButton = newPost.querySelector('.comment-submit-button');
        const commentList = newPost.querySelector('.comment-list');

        commentButton.addEventListener('click', function() {
            commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
        });

        commentSubmitButton.addEventListener('click', function() {
            let commentContent = commentInput.value;
            if (commentContent) {
                addComment(commentList, commentContent, ipAddress);
                commentInput.value = '';
            } else {
                alert("Please write a comment before submitting.");
            }
        });

        postList.prepend(newPost);
        postInput.value = '';
        imageInput.value = ''; // Clear image input
    } else {
        alert("Please write something or attach an image before posting.");
    }
});

// Function to generate a unique username based on IP address in hexadecimal format
function generateUsernameFromIP(ipAddress) {
    const hexString = ipAddress.split('.').map(segment => {
        return parseInt(segment, 10).toString(16).padStart(2, '0');
    }).join('');
    return `User${hexString}`;
}

// Function to add a comment
function addComment(commentList, commentContent, ipAddress) {
    const commentItem = document.createElement('div');
    const commentUsername = generateUsernameFromIP(ipAddress);
    const date = new Date().toLocaleString(); // Get current date
    commentItem.innerHTML = `
        <p>
            <strong class="username">${commentUsername}</strong> 
            <span class="date">(${date})</span>
            <span class="reply-button" style="cursor: pointer; color: blue; text-decoration: underline;">Reply</span>
        </p>
        <p class="reply-content">${commentContent}</p>
        <div class="reply-section" style="display:none;">
            <input type="text" class="reply-input" placeholder="Add a reply...">
            <button class="submit-reply-button">Reply</button>
        </div>
        <div class="replies-section"></div>
    `;
    commentList.appendChild(commentItem);

    // Reply functionality for the newly added comment
    const replyButton = commentItem.querySelector('.reply-button');
    const replySection = commentItem.querySelector('.reply-section');
    const replyInput = commentItem.querySelector('.reply-input');
    const submitReplyButton = commentItem.querySelector('.submit-reply-button');

    replyButton.addEventListener('click', function() {
        replySection.style.display = 'block'; // Show reply input on clicking Reply button
        replyInput.focus(); // Focus on the reply input when opening
    });

    submitReplyButton.addEventListener('click', function() {
        let replyContent = replyInput.value;
        if (replyContent) {
            addReply(commentItem, replyContent, ipAddress);
            replyInput.value = '';
            replySection.style.display = 'none'; // Hide reply input after submitting
        } else {
            alert("Please write a reply before submitting.");
        }
    });
}

// Function to add a reply to a comment
function addReply(commentItem, replyContent, ipAddress) {
    const replyItem = document.createElement('div');
    const replyUsername = generateUsernameFromIP(ipAddress);
    const date = new Date().toLocaleString(); // Get current date
    replyItem.innerHTML = `
        <p>
            <strong class="username">${replyUsername}</strong> 
            <span class="date">(${date})</span>
            <span class="reply-button" style="cursor: pointer; color: blue; text-decoration: underline;">Reply</span>
        </p>
        <p class="reply-content">${replyContent}</p>
        <div class="reply-section" style="display:none;">
            <input type="text" class="reply-input" placeholder="Add a reply...">
            <button class="submit-reply-button">Reply</button>
        </div>
    `;
    
    const repliesSection = commentItem.querySelector('.replies-section');
    repliesSection.appendChild(replyItem);

    // Add reply functionality for the newly added reply
    const replyButton = replyItem.querySelector('.reply-button');
    const replySection = replyItem.querySelector('.reply-section');
    const replyInput = replyItem.querySelector('.reply-input');
    const submitReplyButton = replyItem.querySelector('.submit-reply-button');

    replyButton.addEventListener('click', function() {
        replySection.style.display = 'block'; // Show reply input when clicking the reply button
        replyInput.focus(); // Focus on the reply input when opening
    });

    submitReplyButton.addEventListener('click', function() {
        let replyContent = replyInput.value;
        if (replyContent) {
            addReply(commentItem, replyContent, ipAddress);
            replyInput.value = '';
            replySection.style.display = 'none'; // Hide reply input after submitting
        } else {
            alert("Please write a reply before submitting.");
        }
    });
}
