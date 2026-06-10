class QuizEngine {
    constructor(containerId, questions, trackName = 'general') {
        this.container = document.getElementById(containerId);
        this.questions = questions;
        this.trackName = trackName;  // NEW: explicit track name
        this.currentQuestion = 0;
        this.score = 0;
        this.answers = [];
        this.shuffleQuestions();
    }

    shuffleQuestions() {
        for (let i = this.questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]];
        }
    }

    start() {
        this.currentQuestion = 0;
        this.score = 0;
        this.answers = [];
        this.renderQuestion();
    }

    renderQuestion() {
        const q = this.questions[this.currentQuestion];
        const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;

        this.container.innerHTML = `
            <div class="quiz-progress">
                <span>Question ${this.currentQuestion + 1} of ${this.questions.length}</span>
                <span>Score: ${this.score}</span>
            </div>
            <div class="progress-bar-container">
                <div class="progress-bar-fill" style="width: ${progress}%"></div>
            </div>
            <div class="quiz-question">${q.question}</div>
            <div class="quiz-options">
                ${q.options.map((opt, i) => `
                    <button class="quiz-option" data-index="${i}">${opt}</button>
                `).join('')}
            </div>
            <div class="quiz-feedback hidden"></div>
        `;

        this.container.querySelectorAll('.quiz-option').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectAnswer(parseInt(e.target.dataset.index)));
        });
    }

    selectAnswer(index) {
        const q = this.questions[this.currentQuestion];
        const isCorrect = index === q.correct;
        
        if (isCorrect) this.score++;

        this.answers.push({
            question: q.question,
            selected: index,
            correct: q.correct,
            isCorrect
        });

        const options = this.container.querySelectorAll('.quiz-option');
        options.forEach((opt, i) => {
            opt.disabled = true;
            if (i === q.correct) opt.classList.add('correct');
            if (i === index && !isCorrect) opt.classList.add('wrong');
        });

        const feedback = this.container.querySelector('.quiz-feedback');
        feedback.classList.remove('hidden');
        feedback.innerHTML = isCorrect 
            ? `<p style="color: var(--success);">✅ Correct! ${q.explanation || ''}</p>`
            : `<p style="color: var(--danger);">❌ Incorrect. The correct answer is: ${q.options[q.correct]}. ${q.explanation || ''}</p>`;

        const nextBtn = document.createElement('button');
        nextBtn.className = 'btn btn-primary mt-1';
        nextBtn.textContent = this.currentQuestion < this.questions.length - 1 ? 'Next →' : 'See Results';
        nextBtn.addEventListener('click', () => {
            this.currentQuestion++;
            if (this.currentQuestion < this.questions.length) {
                this.renderQuestion();
            } else {
                this.showResults();
            }
        });
        feedback.appendChild(nextBtn);
    }

    showResults() {
        const percentage = Math.round((this.score / this.questions.length) * 100);
        let grade, emoji, message;

        if (percentage >= 90) { grade = 'Excellent!'; emoji = '🏆'; message = 'You really know your stuff!'; }
        else if (percentage >= 70) { grade = 'Good Job!'; emoji = '👍'; message = 'Solid understanding, keep learning!'; }
        else if (percentage >= 50) { grade = 'Not Bad'; emoji = '📚'; message = 'Review the resources and try again!'; }
        else { grade = 'Keep Learning'; emoji = '💪'; message = 'Everyone starts somewhere. Review and retry!'; }

        this.saveProgress(percentage);

        this.container.innerHTML = `
            <div class="quiz-score">
                <div style="font-size: 4rem;">${emoji}</div>
                <h3>${percentage}%</h3>
                <p style="font-size: 1.3rem; font-weight: 600; color: var(--primary);">${grade}</p>
                <p style="color: var(--text-light); margin-bottom: 1.5rem;">${message}</p>
                <p style="color: var(--text-light);">${this.score} out of ${this.questions.length} correct</p>
                <div class="mt-2">
                    <button class="btn btn-primary" onclick="location.reload()">Retry Quiz</button>
                    <a href="index.html" class="btn btn-outline">Back to Track</a>
                </div>
            </div>
        `;
    }

    saveProgress(percentage) {
        // Use the explicit track name instead of URL path
        const progress = JSON.parse(localStorage.getItem('learningmap_progress') || '{}');
        progress[this.trackName] = {
            score: this.score,
            total: this.questions.length,
            percentage,
            date: new Date().toISOString()
        };
        localStorage.setItem('learningmap_progress', JSON.stringify(progress));
    }
}