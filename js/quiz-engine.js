/**
 * Quiz Engine
 * Reusable quiz system that renders questions, tracks scores,
 * and saves progress to localStorage.
 *
 * Usage:
 *   const quiz = new QuizEngine('container-id', questionsArray, 'track-name');
 *   quiz.start();
 */
var QuizEngine = (function () {
    'use strict';

    /**
     * @constructor
     * @param {string} containerId - DOM element ID for the quiz
     * @param {Array} questions - Array of question objects
     * @param {string} trackName - Identifier for progress tracking
     */
    function QuizEngine(containerId, questions, trackName) {
        this.container = document.getElementById(containerId);
        this.questions = questions || [];
        this.trackName = trackName || 'general';
        this.currentQuestion = 0;
        this.score = 0;
        this.answers = [];

        this._shuffleQuestions();
    }

    /**
     * Shuffle questions array in-place using Fisher-Yates algorithm
     * @private
     */
    QuizEngine.prototype._shuffleQuestions = function () {
        var i, j, temp;

        for (i = this.questions.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            temp = this.questions[i];
            this.questions[i] = this.questions[j];
            this.questions[j] = temp;
        }
    };

    /**
     * Start or restart the quiz
     */
    QuizEngine.prototype.start = function () {
        this.currentQuestion = 0;
        this.score = 0;
        this.answers = [];
        this._renderQuestion();
    };

    /**
     * Render the current question
     * @private
     */
    QuizEngine.prototype._renderQuestion = function () {
        var self = this;
        var q = this.questions[this.currentQuestion];
        var progress = ((this.currentQuestion + 1) / this.questions.length) * 100;

        this.container.innerHTML =
            '<div class="quiz-progress">' +
                '<span>Question ' + (this.currentQuestion + 1) + ' of ' + this.questions.length + '</span>' +
                '<span>Score: ' + this.score + '</span>' +
            '</div>' +
            '<div class="progress-bar-container">' +
                '<div class="progress-bar-fill" style="width: ' + progress + '%"></div>' +
            '</div>' +
            '<div class="quiz-question">' + q.question + '</div>' +
            '<div class="quiz-options">' +
                q.options.map(function (opt, i) {
                    return '<button class="quiz-option" data-index="' + i + '">' + opt + '</button>';
                }).join('') +
            '</div>' +
            '<div class="quiz-feedback hidden"></div>';

        // Attach click handlers
        this.container.querySelectorAll('.quiz-option').forEach(function (btn) {
            btn.addEventListener('click', function () {
                self._selectAnswer(parseInt(this.dataset.index, 10));
            });
        });
    };

    /**
     * Handle answer selection
     * @private
     * @param {number} index - Selected option index
     */
    QuizEngine.prototype._selectAnswer = function (index) {
        var self = this;
        var q = this.questions[this.currentQuestion];
        var isCorrect = index === q.correct;

        if (isCorrect) {
            this.score++;
        }

        this.answers.push({
            question: q.question,
            selected: index,
            correct: q.correct,
            isCorrect: isCorrect
        });

        // Highlight correct/wrong answers
        var options = this.container.querySelectorAll('.quiz-option');
        options.forEach(function (opt, i) {
            opt.disabled = true;
            if (i === q.correct) {
                opt.classList.add('correct');
            }
            if (i === index && !isCorrect) {
                opt.classList.add('wrong');
            }
        });

        // Show feedback
        var feedback = this.container.querySelector('.quiz-feedback');
        feedback.classList.remove('hidden');

        if (isCorrect) {
            feedback.innerHTML = '<p style="color: var(--success);">&check; Correct! ' + (q.explanation || '') + '</p>';
        } else {
            feedback.innerHTML = '<p style="color: var(--danger);">&cross; Incorrect. Correct answer: <strong>' +
                q.options[q.correct] + '</strong>. ' + (q.explanation || '') + '</p>';
        }

        // Add next/results button
        var nextBtn = document.createElement('button');
        nextBtn.className = 'btn btn-primary mt-1';
        nextBtn.textContent = this.currentQuestion < this.questions.length - 1 ? 'Next &rarr;' : 'See Results';

        nextBtn.addEventListener('click', function () {
            self.currentQuestion++;

            if (self.currentQuestion < self.questions.length) {
                self._renderQuestion();
            } else {
                self._showResults();
            }
        });

        feedback.appendChild(nextBtn);
    };

    /**
     * Display final results
     * @private
     */
    QuizEngine.prototype._showResults = function () {
        var percentage = Math.round((this.score / this.questions.length) * 100);
        var grade, emoji, message;

        if (percentage >= 90) {
            grade = 'Excellent!';
            emoji = '&#127942;';
            message = 'You really know your stuff!';
        } else if (percentage >= 70) {
            grade = 'Good Job!';
            emoji = '&#128077;';
            message = 'Solid understanding, keep learning!';
        } else if (percentage >= 50) {
            grade = 'Not Bad';
            emoji = '&#128218;';
            message = 'Review the resources and try again!';
        } else {
            grade = 'Keep Learning';
            emoji = '&#128170;';
            message = 'Everyone starts somewhere. Review and retry!';
        }

        this._saveProgress(percentage);

        this.container.innerHTML =
            '<div class="quiz-score">' +
                '<div style="font-size: 4rem;">' + emoji + '</div>' +
                '<h3>' + percentage + '%</h3>' +
                '<p style="font-size: 1.3rem; font-weight: 600; color: var(--primary);">' + grade + '</p>' +
                '<p style="color: var(--text-light); margin-bottom: 1.5rem;">' + message + '</p>' +
                '<p style="color: var(--text-light);">' + this.score + ' out of ' + this.questions.length + ' correct</p>' +
                '<div class="mt-2">' +
                    '<button class="btn btn-primary" onclick="location.reload()">Retry Quiz</button>' +
                    '<a href="index.html" class="btn btn-outline">Back to Track</a>' +
                '</div>' +
            '</div>';
    };

    /**
     * Save quiz results to localStorage
     * @private
     * @param {number} percentage - Score percentage
     */
    QuizEngine.prototype._saveProgress = function (percentage) {
        var progress = JSON.parse(localStorage.getItem('learningmap_progress') || '{}');

        progress[this.trackName] = {
            score: this.score,
            total: this.questions.length,
            percentage: percentage,
            date: new Date().toISOString()
        };

        localStorage.setItem('learningmap_progress', JSON.stringify(progress));
    };

    return QuizEngine;
})();