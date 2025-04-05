document.getElementById('generateRoutine').addEventListener('click', function() {
    const userName = document.getElementById('userName').value;
    const examTime = document.getElementById('examTime').value || '7 PM - 10 PM'; // default time
    if (!userName) {
        alert('Please enter your name.');
        return;
    }

    // Indicate processing
    this.innerText = "Generating...";
    this.disabled = true;

    const subjects = ['Math', 'Physics', 'Chemistry', 'English', 'Bangla', 'ICT']; // Updated subjects list
    const routine = [];
    const today = new Date();
    today.setDate(today.getDate() + 1); // Start from tomorrow

    // Shuffle the subjects randomly
    const shuffledSubjects = subjects.sort(() => Math.random() - 0.5).slice(0, 6);
    
    setTimeout(() => {
        for (let i = 0; i < 6; i++) {
            const day = new Date(today);
            day.setDate(today.getDate() + i);
            const subject = shuffledSubjects[i]; // Get unique subject
            // Format date to MM/DD/YYYY
            const formattedDate = `${day.getMonth() + 1}/${day.getDate()}/${day.getFullYear()}`;
            routine.push({ date: formattedDate, subject: subject, time: examTime });
        }

        const routineOutput = document.getElementById('routineOutput');

        // Create text-based table with underscores
        const tableHeader = `Date          Subject         Exam Time\n`;
        const underline = `_________________________________________________\n`;
        const tableRows = routine.map(item => 
            `${item.date}    ${item.subject}    ${item.time}`).join('\n');

        routineOutput.innerText = `Hello, ${userName}!\n\n${tableHeader}${underline}${tableRows}`;
        document.getElementById('downloadPDF').style.display = 'block';

        // Reset button text and state
        this.innerText = "Generate Routine";
        this.disabled = false;
    }, 2000); // Simulate a 2-second processing time
});

document.getElementById('downloadPDF').addEventListener('click', function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const routineOutput = document.getElementById('routineOutput').innerText; // Get the routine text
    const userName = document.getElementById('userName').value;

    doc.text(`Hello, ${userName}!`, 10, 10);
    doc.text(routineOutput, 10, 20);
    doc.save('exam_routine.pdf');
});

// Mouse effect for a single line of dots in one color
const dotColor = '#007BFF'; // Define the color of the dots

document.addEventListener('mousemove', function(e) {
    const dot = document.createElement('div');
    dot.className = 'dot';
    dot.style.left = `${e.pageX}px`; // Position dot at the cursor
    dot.style.top = `${e.pageY}px`;
    dot.style.backgroundColor = dotColor; // Set the color
    document.getElementById('mouseEffects').appendChild(dot);
    
    // Remove the dot after animation completes
    dot.addEventListener('animationend', () => {
        dot.remove();
    });
});