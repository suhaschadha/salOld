const EventEmitter = require('events').EventEmitter;

class MyClass extends EventEmitter {
  constructor() {
    super();

    setTimeout(() => {
      this.emit('myEvent', 'hello world', 42);
    }, 1000);
  }
}