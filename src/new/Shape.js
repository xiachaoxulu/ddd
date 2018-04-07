// 图形基类

import Util from './Util'

export default class Shape {
    constructor(x, y, w, h) {
        this.id = Util.getUuid()
        this.renderOptions = {
            x: x || 0,
            y: y || 0,
            w: w || 0,
            h: h || 0,
            lineWidth: 1,
            fillStyle: 'transparent',
            strokeStyle: 'red'
        }
        this.offsetParent = null
        // 是否显示
        this.visible = true
        // 目前考虑只支持2种布局,absolute 相对于canvas 布局,relative 相对于其父布局
        this.position = 'absolute'
        this.children = []
        this.eventBus = {}
    }
    getBoundingClientRect() {
        let x = typeof this.renderOptions.x == "function" ? this.renderOptions.x() : this.renderOptions.x
        let y = typeof this.renderOptions.y == "function" ? this.renderOptions.y() : this.renderOptions.y
        return {
            startX: x,
            startY: y,
            endX: x + this.renderOptions.w,
            endY: y + this.renderOptions.h
        }
    }
    render(ctx) {
        let x = typeof this.renderOptions.x == "function" ? this.renderOptions.x() : this.renderOptions.x
        let y = typeof this.renderOptions.y == "function" ? this.renderOptions.y() : this.renderOptions.y
        ctx.save()
        ctx.fillStyle = this.renderOptions.fillStyle
        ctx.fillRect(x, y, this.renderOptions.w, this.renderOptions.h)
        ctx.lineWidth = this.renderOptions.lineWidth
        ctx.strokeStyle = this.renderOptions.strokeStyle
        ctx.strokeRect(x, y, this.renderOptions.w, this.renderOptions.h)
        ctx.restore()
    }
    addEventListener(eventType, fn) {
        if (this.eventBus[eventType]) {
            this.eventBus[eventType].push(fn)
        }
        else {
            this.eventBus[eventType] = [fn]
        }
    }
}
