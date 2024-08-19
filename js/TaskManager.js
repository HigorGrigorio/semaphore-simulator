export class TaskManager {
  tasks = [];
  semaphore;

  constructor(semaphore) {
    this.semaphore = semaphore;
  }

  addTask(task) {
    this.tasks.push(task);
  }

  async runTasks() {
    for (const task of this.tasks) {
      await task.run();
    }
  }

  getTasks() {
    return this.tasks;
  }

  getSemaphore() {
    return this.semaphore;
  }

  clearTasks() {
    this.tasks = [];
  }

  getTaskById(id) {
    return this.tasks.find((task) => task.getId() === id);
  }

  removeTaskById(id) {
    this.tasks = this.tasks.filter((task) => task.getId() !== id);
  }

  reset() {
    this.tasks = [];
    this.semaphore.reset();
  }
}
