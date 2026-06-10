/**
 * Progress Tracker
 * Manages learning progress stored in localStorage.
 */
var ProgressTracker = (function () {
    'use strict';

    var STORAGE_KEY = 'learningmap_progress';

    /**
     * @constructor
     */
    function ProgressTracker() {}

    /**
     * Get all progress data
     * @returns {Object}
     */
    ProgressTracker.prototype.getAllProgress = function () {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    };

    /**
     * Get progress for a specific track
     * @param {string} track - Track identifier
     * @returns {Object|null}
     */
    ProgressTracker.prototype.getTrackProgress = function (track) {
        var progress = this.getAllProgress();
        return progress[track] || null;
    };

    /**
     * Mark an item as completed within a track
     * @param {string} track - Track identifier
     * @param {string} item - Item to mark as completed
     */
    ProgressTracker.prototype.markCompleted = function (track, item) {
        var progress = this.getAllProgress();

        if (!progress[track]) {
            progress[track] = {
                completed: [],
                score: 0,
                total: 0
            };
        }

        if (progress[track].completed.indexOf(item) === -1) {
            progress[track].completed.push(item);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    };

    /**
     * Check if an item is completed
     * @param {string} track - Track identifier
     * @param {string} item - Item to check
     * @returns {boolean}
     */
    ProgressTracker.prototype.isCompleted = function (track, item) {
        var progress = this.getAllProgress();
        var completed = progress[track] && progress[track].completed;

        return completed ? completed.indexOf(item) !== -1 : false;
    };

    /**
     * Get completion percentage for a track
     * @param {string} track - Track identifier
     * @param {number} totalItems - Total items in the track
     * @returns {number}
     */
    ProgressTracker.prototype.getCompletionPercentage = function (track, totalItems) {
        var progress = this.getAllProgress();

        if (!progress[track]) {
            return 0;
        }

        return Math.round(((progress[track].completed || []).length / totalItems) * 100);
    };

    return ProgressTracker;
})();

// Create global instance
var tracker = new ProgressTracker();