// 线框
import Shape from './Shape';
import ControlRect from './ControlRect';
export default class LineRect extends Shape {
  constructor(x, y, w, h, ctx) {
    super(x, y, w, h, ctx);
    this.reigsterDefaultEvent();
    // 注册默认事件
    let controlW = 12,
      controlH = 12;
    // 8个控制点
    // 1-1
    this.children.push(new ControlRect(-controlW / 2, -controlH / 2, controlW, controlH, ctx));
    // 1-2
    this.children.push(
      new ControlRect(
        () => {
          return this.renderOptions.w / 2 - controlW / 2;
        }, -controlH / 2,
        controlW,
        controlH,
        ctx
      )
    );
    // 1-3
    this.children.push(
      new ControlRect(
        () => {
          return this.renderOptions.w - controlW / 2;
        }, -controlH / 2,
        controlW,
        controlH,
        ctx
      )
    );
    // 2-1
    this.children.push(
      new ControlRect(-controlW / 2,
        () => {
          return this.renderOptions.h / 2 - controlH / 2;
        },
        controlW,
        controlH,
        ctx
      )
    );
    // 2-2
    this.children.push(
      new ControlRect(
        () => {
          return this.renderOptions.w - controlW / 2;
        },
        () => {
          return this.renderOptions.h / 2 - controlH / 2;
        },
        controlW,
        controlH,
        ctx
      )
    );
    // 3-1
    this.children.push(
      new ControlRect(-controlW / 2,
        () => {
          return this.renderOptions.h - controlH / 2;
        },
        controlW,
        controlH,
        ctx
      )
    );
    // 3-2
    this.children.push(
      new ControlRect(
        () => {
          return this.renderOptions.w / 2 - controlW / 2;
        },
        () => {
          return this.renderOptions.h - controlH / 2;
        },
        controlW,
        controlH,
        ctx
      )
    );
    // 3-2
    this.children.push(
      new ControlRect(
        () => {
          return this.renderOptions.w - controlW / 2;
        },
        () => {
          return this.renderOptions.h - controlH / 2;
        },
        controlW,
        controlH,
        ctx
      )
    );
    this.children.forEach((item, index) => {
      item.offsetParent = this;
      item.visible = false;
      let cursor;
      switch (index) {
        case 0:
          cursor = 'nw-resize';
          break;
        case 1:
          cursor = 'n-resize';
          break;
        case 2:
          cursor = 'ne-resize';
          break;
        case 3:
          cursor = 'w-resize';
          break;
        case 4:
          cursor = 'e-resize';
          break;
        case 5:
          cursor = 'sw-resize';
          break;
        case 6:
          cursor = 's-resize';
          break;
        case 7:
          cursor = 'se-resize';
          break;
        default:
          break;
      }
      item.addEventListener('mouseover', () => {
        this.ctx.canvas.style.cursor = cursor;
      });
      item.addEventListener('mouseout', () => {
        this.ctx.canvas.style.cursor = 'default';
      });
      item.addEventListener('resize', (event) => {
        event.direction = cursor
        event.srcNode = this
        this.emitEvent('resize', event)
      })
    });
  }
  clearSelectStatu() {
    if (this.isSelect) {
      this.isSelect = false
      this.children.forEach(item => {
        item.visible = false
      })
      this.emitEvent('reDraw')
    }
  }
  reigsterDefaultEvent() {
    this.isSelect = false
    this.isdraging = false
    this.addEventListener('mouseover', () => {
      if (this.isSelect) {
        this.ctx.canvas.style.cursor = 'move';
      } else {
        this.ctx.canvas.style.cursor = 'pointer';
      }

    });
    this.addEventListener('mousedown', () => {
      if (!this.isSelect) {
        this.ctx.canvas.style.cursor = 'move';
        this.isSelect = true
        this.children.forEach(item => {
          item.visible = true
        })
        this.emitEvent('reDraw')
        this.emitEvent('select', this)
      } else {
        this.isdraging = true
      }
    });
    this.addEventListener('mouseout', () => {
      this.isdraging = false
      this.ctx.canvas.style.cursor = 'default';
    });
    this.addEventListener('mouseup', () => {
      this.isdraging = false
    });
    this.addEventListener('mousemove', (event) => {
      console.log(22, this.isdraging)
      if (this.isdraging) {
        event.srcNode = this
        this.emitEvent('drag', event)
      }
    });

  }
}
