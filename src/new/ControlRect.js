// 控制框
import Shape from './Shape'

export default class ControlRect extends Shape {
    constructor(x, y, w, h) {
        super(x, y, w, h)
        this.renderOptions.fillStyle = "white"
        this.renderOptions.strokeStyle = "black"
        this.position = 'relative'
    }
}
