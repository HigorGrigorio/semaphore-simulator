export class BinarySemaphore {
  count = 1;
  waiting = [];

  async acquire() {
    if (this.count === 0) {
      await new Promise((resolve) => {
        this.waiting.push(resolve);
      });
    } else {
      this.count = 0;
    }
  }

  release() {
    if (this.waiting.length > 0) {
      const resolve = this.waiting.shift();
      resolve && resolve();
    } else {
      this.count = 1;
    }
  }

  reset() {
    this.count = 1;
    this.waiting = [];
  }
}

export class CountingSemaphore {
  count;
  waiting = [];

  constructor(count) {
    this.count = count;
  }

  async acquire() {
    if (this.count === 0) {
      await new Promise((resolve) => {
        this.waiting.push(resolve);
      });
    } else {
      this.count--;
    }
  }

  release() {
    if (this.waiting.length > 0) {
      const resolve = this.waiting.shift();
      resolve && resolve();
    } else {
      this.count++;
    }
  }

  reset() {
    this.count = 0;
    this.waiting = [];
  }

  getCount() {
    return this.count;
  }

  setCount(count) {
    this.count = count;
  }
}

export class Semaphore {
  strategy;

  constructor(options) {
    switch (options.mode) {
      case 'binary':
        this.strategy = new BinarySemaphore();
        break;
      case 'counting':
        this.strategy = new CountingSemaphore(options.count || 1);
        break;
    }
  }

  async acquire() {
    return this.strategy.acquire();
  }

  release() {
    this.strategy.release();
  }

  setMode(mode) {
    const old = this.strategy;

    switch (mode) {
      case 'binary':
        this.strategy = new BinarySemaphore();
        break;
      case 'counting':
        this.strategy = new CountingSemaphore(1);
        break;
    }
  }

  setCount(count) {
    if (this.strategy instanceof CountingSemaphore) {
      this.strategy.setCount(count);
    }
  }

  getCount() {
    if (this.strategy instanceof CountingSemaphore) {
      return this.strategy.count;
    }
  }

  getMode() {
    if (this.strategy instanceof BinarySemaphore) {
      return 'binary';
    } else if (this.strategy instanceof CountingSemaphore) {
      return 'counting';
    }
  }

  reset() {
    this.strategy.reset();
  }
}
