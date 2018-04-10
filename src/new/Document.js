// 管理所有canvas 绘图节点

import LineRect from './LineRect';
export default class Document {
  constructor(ctx) {
    this.dom = [];
    this.ctx = ctx;
    this.__lastMouseEventNode = null;
  }
  // 创建一个节点
  createShape(x, y, w, h, tag = {}) {
    let lineRect = new LineRect(x, y, w, h, tag, this.ctx);
    this.dom.push(lineRect);
    return lineRect;
  }
  deleteNode(id) {
    let find = arr => {
      for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        if (element.id === id) {
          arr.splice(index, 1);
          return;
        } else {
          if (element.children.length > 0) {
            find(element.children);
          }
        }
      }
    };
    find(this.dom);
  }
  // 通过NodeId 获取node
  getNodeById(id) {
    let find = arr => {
      for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        if (element.id === id) {
          return element;
        } else {
          if (element.children.length > 0) {
            return find(element.children);
          }
        }
      }
    };
    find(this.dom);
  }
  // 分发事件给dom节点
  dispatchEvent(event) {
    // 找到 包含 event触发区域 的 最低层节点
    let lastNode = null;
    let find = node => {
      let length = node.children.length;
      if (length > 0) {
        for (let index = length - 1; index >= 0; index--) {
          const element = node.children[index];
          if (!element.visible) {
            continue;
          }
          if (lastNode === null) {
            find(element);
          } else {
            return;
          }
        }
      }
      if (lastNode === null) {
        let offsetX = event.offsetX;
        let offsetY = event.offsetY;
        let rect = node.getBoundingClientRect();
        if (offsetX >= rect.startX && offsetX <= rect.endX && offsetY >= rect.startY && offsetY <= rect.endY) {
          lastNode = node;
        }
      }
    };
    for (let index = this.dom.length - 1; index >= 0; index--) {
      const element = this.dom[index];
      if (lastNode === null) {
        find(element);
      } else {
        break;
      }
    }
    if (lastNode != null) {
      this.excuteEvent(lastNode, event);
    } else {
      // 如果上次有node 处于mouseover 阶段则触发mouseout事件
      if (this.__lastMouseEventNode) {
        this.__lastMouseEventNode.currentEventType = 'mouseout';
        this.__lastMouseEventNode.emitEvent('mouseout', event);
        this.__lastMouseEventNode = null;
      }
    }
  }
  // 触发事件,这里忽略了事件冒泡的处理
  excuteEvent(node, event) {
    if (event.type === 'mousedown' || event.type === 'mouseup') {
      node.emitEvent(event.type, event);
    } else if (event.type === 'mouseover' || event.type === 'mousemove' || event.type === 'mouseout') {
      // 触发上次mouseover节点的mouseout事件
      if (this.__lastMouseEventNode !== null && this.__lastMouseEventNode !== node) {
        this.__lastMouseEventNode.emitEvent('mouseout', event);
        this.__lastMouseEventNode.currentEventType = 'mouseout';
      }
      if (node.currentEventType === null || node.currentEventType === 'mouseout') {
        node.emitEvent('mouseover', event);
        node.currentEventType = 'mouseover';
        this.__lastMouseEventNode = node;
      } else if (node.currentEventType === 'mouseover' || node.currentEventType === 'mousemove') {
        node.emitEvent('mousemove', event);
        node.currentEventType = 'mousemove';
      }
    }
  }

  toString() {
    let arr = [];
    this.dom.forEach(item => {
      arr.push({
        id: item.id,
        client: {
          x: item.renderOptions.x,
          y: item.renderOptions.y,
          w: item.renderOptions.w,
          h: item.renderOptions.h
        },
        tag: item.tag
      });
    });
    return JSON.stringify(arr);
  }
}
