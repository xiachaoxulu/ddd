<template>
  <div>
    <canvas class="bg"></canvas>
    <canvas class="stage" :style="{cursor:cursorStyle}"></canvas>
    <div class="test">
        当前模式：{{mode}}
       <button @click="changeMode(1)">绘制</button>
       <button  @click="changeMode(2)">选择</button>
       <button  @click="deleteNode">删除</button>
       <button  @click="translate">背景平移</button>

    </div>
  </div>
</template>
<script>
import Event from './event';
import Document from './Document';
import Matrix2d from './Matrix2d';
export default {
    data() {
        return {
            mode: 1, // 1 绘制 2选择,
            globalMatrix: {
                a: 2,
                b: 0,
                c: 0,
                d: 2,
                e: -120,
                f: -120
            },
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
        translate() {
            this.globalMatrix.a = 2;
            this.globalMatrix.d = 2;
            this.globalMatrix.e += 10;
            this.globalMatrix.f += 10;

            this.testctx.setTransform(1, 0, 0, 1, 0, 0);
            this.testctx.clearRect(0, 0, this.testctx.canvas.width, this.testctx.canvas.height);
            this.testctx.setTransform(this.globalMatrix.a, 0, 0, this.globalMatrix.d, this.globalMatrix.e, this.globalMatrix.f);
            this.testctx.drawImage(this.img, 0, 0);

            this.document.setMatrix(this.globalMatrix);
            this.update();
            console.log(this.document.dom);
        },
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
                let inventPoint = Matrix2d.invertTransformPoint(this.globalMatrix, { x: event.offsetX, y: event.offsetY });
                let lastX = inventPoint.x;
                let lastY = inventPoint.y;
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
                console.log(this.currentDom.renderOptions, this.currentDom.getBoundingClientRect());
                this.update();
                this.firstPoint = null;
                this.isdrawing = false;
                this.mode = 2;
            }
        },
        onmousedown(event) {
            if (this.mode === 1) {
                this.isdrawing = true;
                let inventPoint = Matrix2d.invertTransformPoint(this.globalMatrix, { x: event.offsetX, y: event.offsetY });
                this.firstPoint = inventPoint;
                this.currentDom = this.document.createShape(inventPoint.x, inventPoint.y, 0, 0, this.ctx);
                this.currentDom.addEventListener('resize', this.ShapeResize);
                this.currentDom.addEventListener('drag', this.ShapeDrag);
                this.currentDom.addEventListener('select', this.ShapeSelect);
                this.currentDom.addEventListener('reDraw', this.reDraw);
            } else {
                // 点击空白处清除当前选择;
                if (this.currentSelectNode) {
                    let rect = this.currentSelectNode.getBoundingClientRect();
                    // 这里做了选中状态下控制条尺寸的纠错
                    let dot = 12;
                    rect.startX -= dot;
                    rect.startY -= dot;
                    rect.endX += dot;
                    rect.endY += dot;
                    let startPoint = Matrix2d.transformPoint(this.globalMatrix, { x: rect.startX, y: rect.startY });
                    let endPoint = Matrix2d.transformPoint(this.globalMatrix, { x: rect.endX, y: rect.endY });
                    rect.startX = startPoint.x;
                    rect.startY = startPoint.y;
                    rect.endX = endPoint.x;
                    rect.endY = endPoint.y;
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
            let inventPoint = Matrix2d.invertTransformPoint(this.globalMatrix, { x: event.offsetX, y: event.offsetY });
            let x = inventPoint.x;
            let y = inventPoint.y;
            let center = {
                x: rect.startX + rect.width / 2,
                y: rect.startY + rect.height / 2
            };
            let translate = {
                x: x - center.x,
                y: y - center.y
            };
            node.renderOptions.x += translate.x;
            node.renderOptions.y += translate.y;
            this.update();
        },
        // 线框resize
        ShapeResize(event) {
            window.getSelection().removeAllRanges();
            let node = event.srcNode;
            let rect = node.getBoundingClientRect();
            let inventPoint = Matrix2d.invertTransformPoint(this.globalMatrix, { x: event.offsetX, y: event.offsetY });
            let x = inventPoint.x;
            let y = inventPoint.y;
            switch (event.direction) {
                case 'nw-resize':
                    node.renderOptions.w += -(x - rect.startX);
                    node.renderOptions.h += -(y - rect.startY);
                    node.renderOptions.x = x;
                    node.renderOptions.y = y;
                    break;
                case 'n-resize':
                    node.renderOptions.h += -(y - rect.startY);
                    node.renderOptions.y = y;
                    break;
                case 'ne-resize':
                    node.renderOptions.w += x - rect.endX;
                    node.renderOptions.h += -(y - rect.startY);
                    node.renderOptions.y = y;
                    break;
                case 'w-resize':
                    node.renderOptions.w += -(x - rect.startX);
                    node.renderOptions.x = x;
                    break;
                case 'e-resize':
                    node.renderOptions.w += x - rect.endX;
                    break;
                case 'sw-resize':
                    node.renderOptions.w += -(x - rect.startX);
                    node.renderOptions.h += y - rect.endY;
                    node.renderOptions.x = x;

                    break;
                case 's-resize':
                    node.renderOptions.h += y - rect.endY;
                    break;
                case 'se-resize':
                    node.renderOptions.w += x - rect.endX;
                    node.renderOptions.h += y - rect.endY;

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

            this.ctx.setTransform(this.globalMatrix.a, this.globalMatrix.b, this.globalMatrix.c, this.globalMatrix.d, this.globalMatrix.e, this.globalMatrix.f);
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
        this.document.setMatrix(this.globalMatrix);

        // test test
        let test = this.$el.querySelector('.bg');
        test.width = '800';
        test.height = '500';
        this.testctx = test.getContext('2d');
        this.testctx.setTransform(this.globalMatrix.a, 0, 0, this.globalMatrix.d, this.globalMatrix.e, this.globalMatrix.f);

        var img = new Image();
        this.img = img;
        img.src = 'https://t11.baidu.com/it/u=3026801077,1477042677&fm=173&app=12&f=JPEG?w=442&h=316&s=698A2ED2505265CECCAC8E290300F0D7';
        img.onload = () => {
            this.testctx.drawImage(img, 0, 0);
        };
    }
};
</script>
<style lang="less">
.bg,
.stage {
    width: 800px;
    height: 500px;
    position: absolute;
}
.bg {
    background-color: wheat;
}
.stage {
    background-color: transparent;
    z-index: 2;
}
.test {
    position: absolute;
    top: 520px;
}
</style>
