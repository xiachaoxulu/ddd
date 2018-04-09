// 控制框
import Shape from './Shape';

export default class ControlRect extends Shape {
  constructor(x, y, w, h, ctx) {
    super(x, y, w, h, ctx);
    this.renderOptions.fillStyle = 'white';
    this.renderOptions.strokeStyle = 'black';
    this.position = 'relative';

    this.reigsterDragEvent();
  }

  reigsterDragEvent() {
    this.isresizing = false;
    this.addEventListener('mousedown', () => {
      this.isresizing = true;
    });
    this.addEventListener('mouseout', () => {
      this.isresizing = false;
    });
    this.addEventListener('mouseup', () => {
      this.isresizing = false;
    });
    this.addEventListener('mousemove', event => {
      if (this.isresizing) {
        this.emitEvent('resize', event);
      }
    });
  }
}
