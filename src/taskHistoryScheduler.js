// src/taskHistoryScheduler.js

const timeoutMap = new Map();

export const taskHistoryScheduler = {
  /**
   * Lên lịch chuyển task vào history sau 10 giây.
   * @param {Object} task - Task cần chuyển
   * @param {Function} moveToHistoryFn - Hàm thực thi khi đến giờ
   */
  schedule(task, moveToHistoryFn) {
    this.cancel(task.id); // nếu đã có, hủy cũ

    const timeoutId = setTimeout(() => {
      if (timeoutMap.has(task.id)) {
        moveToHistoryFn(task);
        timeoutMap.delete(task.id);
      }
    }, 10000);

    timeoutMap.set(task.id, timeoutId);
  },

  /**
   * Hủy lịch chuyển task vào history (nếu tồn tại)
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
   * Kiểm tra task có đang được hẹn lịch move không
   * @param {string} taskId
   * @returns {boolean}
   */
  isScheduled(taskId) {
    return timeoutMap.has(taskId);
  }
};
