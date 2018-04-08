// 控制框
import Shape from './Shape';

export default class ControlRect extends Shape {
  constructor(x, y, w, h, ctx) {
    super(x, y, w, h, ctx);
    this.renderOptions.fillStyle = 'white';
    this.renderOptions.strokeStyle = 'black';
    this.position = 'relative';
  }
}
