// 线框
import Shape from './Shape'
import ControlRect from './ControlRect'
export default class LineRect extends Shape {
    constructor(x, y, w, h) {
        super(x, y, w, h)
        let controlW = 6, controlH = 6
        // 8个控制点
        // 1-1
        this.children.push(new ControlRect(-controlW / 2, - controlH / 2, controlW, controlH))
        // 1-2
        this.children.push(new ControlRect(() => { return (this.renderOptions.w / 2 - controlW / 2) }, -controlH / 2, controlW, controlH))
        // 1-3
        this.children.push(new ControlRect(() => { return (this.renderOptions.w - controlW / 2) }, -controlH / 2, controlW, controlH))
        // 2-1
        this.children.push(new ControlRect(-controlW / 2, () => { return (this.renderOptions.h / 2 - controlH / 2) }, controlW, controlH))
        // 2-2
        this.children.push(new ControlRect(() => { return (this.renderOptions.w - controlW / 2) }, () => { return (this.renderOptions.h / 2 - controlH / 2) }, controlW, controlH))
        // 3-1
        this.children.push(new ControlRect(-controlW / 2, () => { return (this.renderOptions.h - controlH / 2) }, controlW, controlH))
        // 3-2
        this.children.push(new ControlRect(() => { return (this.renderOptions.w / 2 - controlW / 2) }, () => { return (this.renderOptions.h - controlH / 2) }, controlW, controlH))
        // 3-2
        this.children.push(new ControlRect(() => { return (this.renderOptions.w - controlW / 2) }, () => { return (this.renderOptions.h - controlH / 2) }, controlW, controlH))
        this.children.forEach((item) => {
            item.offsetParent = this
            item.visible = false
        })

    }
}
