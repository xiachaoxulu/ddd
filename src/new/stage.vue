<template>
  <div>
    <canvas class="stage" :style="{cursor:cursorStyle}"></canvas>
    <div class="test">
        当前模式：{{mode}}
       <button @click="changeMode(1)">绘制</button>
       <button  @click="changeMode(2)">选择</button>
       <button  @click="deleteNode">删除</button>
    </div>
  </div>
</template>
<script>
import Event from './event';
import Document from './Document';
export default {
    data() {
        return {
            mode: 1, // 1 绘制 2选择
            isdrawing: false
        };
    },
    computed: {
        cursorStyle() {
            if (this.mode === 1) {
                return 'crosshair';
            } else {
                return 'default';
            }
        }
    },
    methods: {
        deleteNode() {
            if (this.currentSelectNode) {
                this.document.deleteNode(this.currentSelectNode.id);
                this.update();
            }
        },
        changeMode(val) {
            this.mode = val;
        },
        onEvent(event) {
            switch (event.type) {
                case 'mousedown':
                    this.onmousedown(event);
                    break;
                case 'mouseover':
                    this.onmouseover(event);
                    break;
                case 'mouseup':
                    this.onmouseup(event);
                    break;
                case 'mouseout':
                    this.onmouseout(event);
                    break;
                case 'mousemove':
                    this.onmousemove(event);
                    break;
            }
            if (this.mode !== 1) {
                this.document.dispatchEvent(event);
            }
        },
        onmousemove(event) {
            if (this.isdrawing) {
                let lastX = event.offsetX;
                let lastY = event.offsetY;
                let firstX = this.firstPoint.x;
                let firstY = this.firstPoint.y;
                // 第二点落在以第一点为原点的四个象棋时要有不同的处理,即: 谁小取谁的值 作为起始点
                // 第一象限
                this.currentDom.renderOptions.x = firstX >= lastX ? lastX : firstX;
                this.currentDom.renderOptions.y = firstY >= lastY ? lastY : firstY;
                this.currentDom.renderOptions.w = Math.abs(lastX - firstX);
                this.currentDom.renderOptions.h = Math.abs(firstY - lastY);
                this.update();
            }
        },
        onmouseup() {
            if (this.isdrawing) {
                if (this.currentDom) {
                    let w = this.currentDom.renderOptions.w;
                    let h = this.currentDom.renderOptions.h;
                    this.currentDom.renderOptions.w = w < 20 ? 20 : w;
                    this.currentDom.renderOptions.h = h < 20 ? 20 : h;
                }
                this.update();
                this.firstPoint = null;
                this.isdrawing = false;
                this.mode = 2;
            }
        },
        onmousedown(event) {
            if (this.mode === 1) {
                this.isdrawing = true;
                this.firstPoint = {
                    x: event.offsetX,
                    y: event.offsetY
                };
                this.currentDom = this.document.createShape(event.offsetX, event.offsetY, 0, 0, this.ctx);
                this.currentDom.addEventListener('resize', this.ShapeResize);
                this.currentDom.addEventListener('drag', this.ShapeDrag);
                this.currentDom.addEventListener('select', this.ShapeSelect);
                this.currentDom.addEventListener('reDraw', this.reDraw);
            } else {
                // 点击空白处清除当前选择
                if (this.currentSelectNode) {
                    let rect = this.currentSelectNode.getBoundingClientRect();
                    // 这里做了选中状态下控制条尺寸的纠错
                    let dot = 12;
                    rect.startX -= dot;
                    rect.startY -= dot;
                    rect.endX += dot;
                    rect.endY += dot;
                    if (event.offsetX >= rect.startX && event.offsetX <= rect.endX && event.offsetY >= rect.startY && event.offsetY <= rect.endY) {
                        return;
                    } else {
                        this.currentSelectNode.clearSelectStatu();
                        this.currentSelectNode = null;
                    }
                }
            }
        },
        onmouseout() {},
        onmouseover() {},
        reDraw() {
            this.update();
        },
        ShapeSelect(node) {
            if (this.currentSelectNode) {
                this.currentSelectNode.clearSelectStatu();
            }
            this.currentSelectNode = node;
        },
        // 线框拖拽
        ShapeDrag(event) {
            window.getSelection().removeAllRanges();
            let node = event.srcNode;
            let rect = node.getBoundingClientRect();
            let center = {
                x: rect.startX + rect.width / 2,
                y: rect.startY + rect.height / 2
            };
            let translate = {
                x: event.offsetX - center.x,
                y: event.offsetY - center.y
            };
            node.renderOptions.x += translate.x;
            node.renderOptions.y += translate.y;
            this.update();
            // console.log('drag', node);
        },
        // 线框resize
        ShapeResize(event) {
            window.getSelection().removeAllRanges();
            let node = event.srcNode;
            let rect = node.getBoundingClientRect();
            switch (event.direction) {
                case 'nw-resize':
                    node.renderOptions.w += -(event.offsetX - rect.startX);
                    node.renderOptions.h += -(event.offsetY - rect.startY);
                    node.renderOptions.x = event.offsetX;
                    node.renderOptions.y = event.offsetY;
                    break;
                case 'n-resize':
                    node.renderOptions.h += -(event.offsetY - rect.startY);
                    node.renderOptions.y = event.offsetY;
                    break;
                case 'ne-resize':
                    node.renderOptions.w += event.offsetX - rect.endX;
                    node.renderOptions.h += -(event.offsetY - rect.startY);
                    node.renderOptions.y = event.offsetY;
                    break;
                case 'w-resize':
                    node.renderOptions.w += -(event.offsetX - rect.startX);
                    node.renderOptions.x = event.offsetX;
                    break;
                case 'e-resize':
                    node.renderOptions.w += event.offsetX - rect.endX;
                    break;
                case 'sw-resize':
                    node.renderOptions.w += -(event.offsetX - rect.startX);
                    node.renderOptions.h += event.offsetY - rect.endY;
                    node.renderOptions.x = event.offsetX;

                    break;
                case 's-resize':
                    node.renderOptions.h += event.offsetY - rect.endY;
                    break;
                case 'se-resize':
                    node.renderOptions.w += event.offsetX - rect.endX;
                    node.renderOptions.h += event.offsetY - rect.endY;

                    break;
                default:
                    break;
            }
            this.update();
        },
        // 重新绘制
        update() {
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            let paint = root => {
                if (root && root.length > 0) {
                    root.forEach(item => {
                        if (item.visible === false) {
                            return;
                        }
                        if (item.position === 'relative' && item.offsetParent !== null) {
                            this.ctx.save();
                            let translate = item.offsetParent.getBoundingClientRect();
                            this.ctx.translate(translate.startX, translate.startY);
                            item.render();
                            this.ctx.restore();
                        } else {
                            item.render();
                        }
                        if (item.children) {
                            paint(item.children);
                        }
                    });
                } else {
                    return;
                }
            };
            paint(this.document.dom);
        }
    },
    mounted() {
        this.canvas = this.$el.querySelector('.stage');
        this.canvas.width = '800';
        this.canvas.height = '500';
        this.ctx = this.canvas.getContext('2d');
        this.event = new Event(this.canvas);
        this.event.onEvent('all', this.onEvent);
        this.document = new Document();
    }
};
</script>
<style lang="less">
.stage {
    width: 800px;
    height: 500px;
    background-color: wheat;
}
</style>
