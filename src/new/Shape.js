// 图形基类

import Util from './Util';

export default class Shape {
  constructor(x, y, w, h, tag, ctx) {
    this.ctx = ctx;
    this.id = Util.getUuid();
    this.renderOptions = {
      x: x || 0,
      y: y || 0,
      w: w || 0,
      h: h || 0,
      lineWidth: 1,
      fillStyle: 'transparent',
      strokeStyle: 'red'
    };
    this.offsetParent = null;
    // 是否显示
    this.visible = true;
    // 目前考虑只支持2种布局,absolute 相对于canvas 布局,relative 相对于其父布局
    this.position = 'absolute';
    this.children = [];
    this.eventBus = {};
    // 数据仓库
    this.tag = tag || {};
    // 当前的事件类型
    this.currentEventType = null;
  }
  getBoundingClientRect() {
    let x = typeof this.renderOptions.x == 'function' ? this.renderOptions.x() : this.renderOptions.x;
    let y = typeof this.renderOptions.y == 'function' ? this.renderOptions.y() : this.renderOptions.y;
    let startX = x,
      startY = y;
    if (this.offsetParent !== null && this.position === 'relative') {
      startX = x + this.offsetParent.getBoundingClientRect().startX;
      startY = y + this.offsetParent.getBoundingClientRect().startY;
    }
    return {
      startX: startX,
      startY: startY,
      width: this.renderOptions.w,
      height: this.renderOptions.h,
      endX: startX + this.renderOptions.w,
      endY: startY + this.renderOptions.h
    };
  }
  render() {
    let x = typeof this.renderOptions.x == 'function' ? this.renderOptions.x() : this.renderOptions.x;
    let y = typeof this.renderOptions.y == 'function' ? this.renderOptions.y() : this.renderOptions.y;
    this.ctx.save();
    this.ctx.fillStyle = this.renderOptions.fillStyle;
    this.ctx.fillRect(x, y, this.renderOptions.w, this.renderOptions.h);
    this.ctx.lineWidth = this.renderOptions.lineWidth;
    this.ctx.strokeStyle = this.renderOptions.strokeStyle;
    this.ctx.strokeRect(x, y, this.renderOptions.w, this.renderOptions.h);
    this.ctx.restore();
  }
  addEventListener(eventType, fn) {
    if (this.eventBus[eventType]) {
      this.eventBus[eventType].push(fn);
    } else {
      this.eventBus[eventType] = [fn];
    }
  }
  emitEvent(eventType, event) {
    if (this.eventBus[eventType]) {
      this.eventBus[eventType].forEach(item => {
        item.call(this, event);
      });
    }
  }
}
