class ProgressTracker {
    constructor() {
        this.storageKey = 'learningmap_progress';
    }

    getAllProgress() {
        return JSON.parse(localStorage.getItem(this.storageKey) || '{}');
    }

    getTrackProgress(track) {
        const progress = this.getAllProgress();
        return progress[track] || null;
    }

    markCompleted(track, item) {
        const progress = this.getAllProgress();
        if (!progress[track]) progress[track] = { completed: [], score: 0, total: 0 };
        if (!progress[track].completed.includes(item)) {
            progress[track].completed.push(item);
        }
        localStorage.setItem(this.storageKey, JSON.stringify(progress));
    }

    isCompleted(track, item) {
        const progress = this.getAllProgress();
        return progress[track]?.completed?.includes(item) || false;
    }

    getCompletionPercentage(track, totalItems) {
        const progress = this.getAllProgress();
        if (!progress[track]) return 0;
        return Math.round((progress[track].completed?.length || 0) / totalItems * 100);
    }

    renderDashboard() {
        const container = document.getElementById('progress-dashboard');
        if (!container) return;

        const progress = this.getAllProgress();
        const tracks = [
            { id: 'web-development', name: 'Web Development', total: 4, icon: '🌐' },
            { id: 'cybersecurity', name: 'Cybersecurity', total: 4, icon: '🔒' },
            { id: 'ethical-hacking', name: 'Ethical Hacking', total: 4, icon: '🎯' }
        ];

        container.innerHTML = tracks.map(track => {
            const trackProgress = progress[track.id];
            const completed = trackProgress?.completed?.length || 0;
            const percentage = Math.round((completed / track.total) * 100);
            const quizScore = trackProgress?.percentage || 0;

            return `
                <div class="card">
                    <div style="font-size: 2rem;">${track.icon}</div>
                    <h3>${track.name}</h3>
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width: ${percentage}%"></div>
                    </div>
                    <p style="font-size: 0.85rem; color: var(--text-light);">
                        ${completed}/${track.total} sections completed
                        ${quizScore ? `| Quiz: ${quizScore}%` : ''}
                    </p>
                </div>
            `;
        }).join('');
    }
}

const tracker = new ProgressTracker();
document.addEventListener('DOMContentLoaded', () => tracker.renderDashboard());