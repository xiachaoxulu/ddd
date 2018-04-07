// canvas 事件模型
let instance
export default class EventModel {
  constructor(canvas) {
    if (instance) {
      return instance
    }
    instance = this
    this.canvas = canvas
    this.init()
  }
  init() {
    this.canvas.addEventListener('mousedown', this)
    this.canvas.addEventListener('mouseover', this)
    this.canvas.addEventListener('mouseup', this)
    this.canvas.addEventListener('mouseout', this)
    this.canvas.addEventListener('mousemove', this)
    this.canvas.addEventListener('touchstart', this)
    this.canvas.addEventListener('touchmove', this)
    this.canvas.addEventListener('touchcancel', this)
    this.canvas.addEventListener('touchend', this)
    this.canvas.addEventListener('keydown', this)
    this.canvas.addEventListener('keyup', this)
    this.canvas.addEventListener('keypress', this)
  }
  handleEvent(event) {
    switch (event.type) {
      case 'mousedown':
        this.onmousedown(event)
        break
      case 'mouseover':
        this.onmouseover(event)
        break
      case 'mouseup':
        this.onmouseup(event)
        break
      case 'mouseout':
        this.onmouseout(event)
        break
      case 'mousemove':
        this.onmousemove(event)
        break
      case 'touchstart':
        this.ontouchstart(event)
        break
      case 'touchmove':
        this.ontouchmove(event)
        break
      case 'touchcancel':
        this.ontouchcancel(event)
        break
      case 'touchend':
        this.ontouchend(event)
        break
      case 'keydown':
        this.onkeydown(event)
        break
      case 'keyup':
        this.onkeyup(event)
        break
      case 'keypress':
        this.onkeypress(event)
        break
    }
  }
  onmousedown() {}
  onmouseover() {}
  onmouseup() {}
  onmouseout() {}
  onmousemove() {}
  ontouchstart() {}
  ontouchmove() {}
  ontouchcancel() {}
  ontouchend() {}
  onkeydown() {}
  onkeyup() {}
  onkeypress() {}
}
