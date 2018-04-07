// 图形基类
const defaultOptions = {
  x: 0,
  y: 0,
  w: 0,
  h: 0,
  fillStyle: '#D8D8D8',
  strokeStyle: '#979797'
}
export default class Element {
  constructor(x, y, w, h) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h

    this.fillStyle = 'red'
    this.strokeStyle = '#979797'
  }
  getBoundingClientRect() {
    return {
      startX: this.x * (screenWidth / 375),
      startY: this.y * (screenHeight / 667),
      endX: (this.x + this.w) * (screenWidth / 375),
      endY: (this.y + this.h) * (screenHeight / 667)
    }
  }
  render(ctx) {
    ctx.save()
    // if (this.needFill) {
    ctx.fillStyle = this.fillStyle
    ctx.fillRect(this.x, this.y, this.w, this.h)
    // }
    if (this.needStroke) {
      ctx.lineWidth = this.lineWidth
      ctx.strokeStyle = this.strokeStyle
      ctx.strokeRect(this.x, this.y, this.w, this.h)
    }
    ctx.restore()
  }
}
