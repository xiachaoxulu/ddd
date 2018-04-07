<template>
  <div>
    <canvas class="stage" :style="{cursor:cursorStyle}"></canvas>
    <div class="test">
        当前模式：{{mode}}
       <button @click="changeMode(1)">绘制</button>
       <button  @click="changeMode(2)">选择</button>
    </div>
  </div>
</template>
<script>
import Event from "./event";
import Document from "./Document";
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
        return "crosshair";
      } else {
        return "default";
      }
    }
  },
  methods: {
    changeMode(val) {
      this.mode = val;
    },
    onEvent(event) {
      switch (event.type) {
        case "mousedown":
          this.onmousedown(event);
          break;
        case "mouseover":
          this.onmouseover(event);
          break;
        case "mouseup":
          this.onmouseup(event);
          break;
        case "mouseout":
          this.onmouseout(event);
          break;
        case "mousemove":
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
        this.document.currentDom.renderOptions.x =
          firstX >= lastX ? lastX : firstX;
        this.document.currentDom.renderOptions.y =
          firstY >= lastY ? lastY : firstY;
        this.document.currentDom.renderOptions.w = Math.abs(lastX - firstX);
        this.document.currentDom.renderOptions.h = Math.abs(firstY - lastY);
        this.update();
      }
    },
    onmouseup() {
      if (this.isdrawing) {
        if (this.document.currentDom) {
          let w = this.document.currentDom.renderOptions.w;
          let h = this.document.currentDom.renderOptions.h;
          this.document.currentDom.renderOptions.w = w < 20 ? 20 : w;
          this.document.currentDom.renderOptions.h = h < 20 ? 20 : h;
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
        this.document.createShape(event.offsetX, event.offsetY, 0, 0);
      }
    },
    onmouseout() {},
    onmouseover() {},
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
            if (item.position === "relative" && item.offsetParent !== null) {
              this.ctx.save();
              let translate = item.offsetParent.getBoundingClientRect();
              this.ctx.translate(translate.startX, translate.startY);
              item.render(this.ctx);
              this.ctx.restore();
            } else {
              item.render(this.ctx);
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
    this.canvas = this.$el.querySelector(".stage");
    this.canvas.width = "800";
    this.canvas.height = "500";
    this.ctx = this.canvas.getContext("2d");
    this.event = new Event(this.canvas);
    this.event.onEvent("all", this.onEvent);
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
