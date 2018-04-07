// 管理所有canvas 绘图节点

import LineRect from './LineRect'

export default class Document {
    constructor() {
        this.dom = []
        this.currentDom = null
    }
    // 创建一个节点
    createShape(x, y, w, h) {
        let lineRect = new LineRect(x, y, w, h)
        this.currentDom = lineRect
        this.dom.push(lineRect);
    }
    // 分发事件给dom节点
    dispatchEvent(event) {
        // 找到 包含 event触发区域 的 最低层节点
        let lastNode = null
        let find = (node) => {
            let length = node.children.length
            if (length > 0) {
                for (let index = length - 1; index >= 0; index--) {
                    const element = node.children[index];
                    if (!element.visible) {
                        continue
                    }
                    if (lastNode === null) {
                        find(element)
                    }
                    else {
                        return
                    }
                }
            }
            if (lastNode === null) {
                let offsetX = event.offsetX
                let offsetY = event.offsetY
                let rect = node.getBoundingClientRect()
                if (offsetX >= rect.startX && offsetX <= rect.endX && offsetY >= rect.startY && offsetY <= rect.endY) {
                    lastNode = node
                }
            }
        }
        for (let index = this.dom.length - 1; index >= 0; index--) {
            const element = this.dom[index];
            if (lastNode === null) {
                find(element)
            }
            else {
                break
            }
        }
        if (lastNode != null) {
            this.BubbleEvent(lastNode, event)
        }
    }
    // 冒泡触发事件
    BubbleEvent(node, event) {

    }
}