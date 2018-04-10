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
       <button  @click="toString">tostring</button>
    </div>
  </div>
</template>
<script>
import Event from './Event';
import Document from './Document';
import Matrix2d from './Matrix2d';
export default {
    data() {
        return {
            mode: 1, // 1 绘制 2选择,
            globalMatrix: {
                a: 1,
                b: 0,
                c: 0,
                d: 1,
                e: 0,
                f: 0
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
        toString() {
            console.log(this.document.toString());
        },
        translate() {
            this.globalMatrix.a = 2;
            this.globalMatrix.d = 2;
            this.globalMatrix.e += 10;
            this.globalMatrix.f += 10;

            this.testctx.setTransform(1, 0, 0, 1, 0, 0);
            this.testctx.clearRect(0, 0, this.testctx.canvas.width, this.testctx.canvas.height);
            this.testctx.setTransform(this.globalMatrix.a, 0, 0, this.globalMatrix.d, this.globalMatrix.e, this.globalMatrix.f);
            this.testctx.drawImage(this.img, 0, 0);

            // this.document.setMatrix(this.globalMatrix);
            this.update();
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
            let selfEvent = {};
            selfEvent.type = event.type;
            let inventPoint = Matrix2d.invertTransformPoint(this.globalMatrix, { x: event.offsetX, y: event.offsetY });
            selfEvent.offsetX = inventPoint.x;
            selfEvent.offsetY = inventPoint.y;
            switch (selfEvent.type) {
                case 'mousedown':
                    this.onmousedown(selfEvent);
                    break;
                case 'mouseover':
                    this.onmouseover(selfEvent);
                    break;
                case 'mouseup':
                    this.onmouseup(selfEvent);
                    break;
                case 'mouseout':
                    this.onmouseout(selfEvent);
                    break;
                case 'mousemove':
                    this.onmousemove(selfEvent);
                    break;
            }
            if (this.mode !== 1) {
                this.document.dispatchEvent(selfEvent);
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
                this.currentDom = this.document.createShape(event.offsetX, event.offsetY, 0, 0);
                this.initNodeEvent(this.currentDom);
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
        initNodeEvent(node) {
            node.addEventListener('resize', this.ShapeResize);
            node.addEventListener('drag', this.ShapeDrag);
            node.addEventListener('select', this.ShapeSelect);
            node.addEventListener('reDraw', this.reDraw);
        },
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
        },
        // 线框resize
        ShapeResize(event) {
            window.getSelection().removeAllRanges();
            let node = event.srcNode;
            let rect = node.getBoundingClientRect();
            let x = event.offsetX;
            let y = event.offsetY;
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
        this.document = new Document(this.ctx);

        let testJson = JSON.parse(
            '[{"id":"3b308e4fb35a021e","client":{"x":74,"y":62,"w":102,"h":74},"tag":{}},{"id":"baf261663ee90bce","client":{"x":227,"y":51,"w":74,"h":76},"tag":{}}]'
        );
        testJson.forEach(item => {
            let node = this.document.createShape(item.client.x, item.client.y, item.client.w, item.client.h, item.tag);
            this.initNodeEvent(node);
        });
        this.update();
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
