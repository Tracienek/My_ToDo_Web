// src/taskHistoryScheduler.js

const timeoutMap = new Map();

export const taskHistoryScheduler = {
  /**
   * @param {Object} task 
   * @param {Function} moveToHistoryFn 
   */
  schedule(task, moveToHistoryFn) {
    this.cancel(task.id); 

    const timeoutId = setTimeout(() => {
      if (timeoutMap.has(task.id)) {
        moveToHistoryFn(task);
        timeoutMap.delete(task.id);
      }
    }, 10000);

    timeoutMap.set(task.id, timeoutId);
  },

  /**
   * 
   * @param {string} taskId
   */
  cancel(taskId) {
    const timeoutId = timeoutMap.get(taskId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutMap.delete(taskId);
    }
  },

  /**
   * 
   * @param {string} taskId
   * @returns {boolean}
   */
  isScheduled(taskId) {
    return timeoutMap.has(taskId);
  }
};
