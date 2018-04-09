// rootNode 事件模型

export default class Event {
  constructor(rootNode) {
    this.rootNode = rootNode;
    this.eventBus = {};
    this.events = ['mouseenter', 'mousedown', 'mouseover', 'mouseup', 'mouseout', 'mousemove', 'keydown', 'keyup', 'keypress'];
    this.events.forEach(item => {
      this.rootNode.addEventListener(item, this);
    });
  }
  onEvent(eventType, fn) {
    if (eventType.toUpperCase() === 'all'.toUpperCase()) {
      this.events.forEach(item => {
        if (this.eventBus[item]) {
          this.eventBus[item].push(fn);
        } else {
          this.eventBus[item] = [fn];
        }
      });
    } else {
      if (this.eventBus[eventType]) {
        this.eventBus[eventType].push(fn);
      } else {
        this.eventBus[eventType] = [fn];
      }
    }
  }
  handleEvent(event) {
    // 处理一下move事件触发频率 让其发生的频率控制在16ms每次
    let eventType = event.type;
    let fn = () => {
      if (this.eventBus[eventType]) {
        this.eventBus[eventType].forEach(item => {
          item.call(this.rootNode, event);
        });
      }
    };
    if (eventType.toUpperCase() === 'mousemove'.toUpperCase()) {
      let now = new Date();
      if (this.lastMoveDate) {
        if (now - this.lastMoveDate >= 10) {
          this.lastMoveDate = now;
          fn();
        }
      } else {
        this.lastMoveDate = now;
        fn();
      }
    } else {
      fn();
    }
  }
}
