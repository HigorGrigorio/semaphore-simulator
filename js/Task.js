import {createId} from "./Id.js";

export class Task {
  id;
  name;
  status = 'pending';
  semaphore;
  onStateChange;

  constructor(id, name, semaphore, onStateChange) {
    this.id = id;
    this.name = name;
    this.semaphore = semaphore;
    this.onStateChange = onStateChange;
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getStatus() {
    return this.status;
  }

  async run() {
    await this.semaphore.acquire();

    this.status = 'running';
    // notify the task taskManager that the state has changed
    this.onStateChange && this.onStateChange(this);

    setTimeout(() => {
      this.status = 'completed';
      this.onStateChange && this.onStateChange(this);
      this.semaphore.release();
    },
      // interval between 1 and 5 seconds
      Math.floor(Math.random() * 5) * 1000
      );
  }

  setSemaphore(semaphore) {
    this.semaphore = semaphore;
  }
}
