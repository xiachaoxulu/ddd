<template>
  <div class="stage">
      <canvas   class="axis"></canvas>
      <canvas class="main"></canvas>
      <canvas   tabindex="0" class="grid"  @mouseenter="mouseenter"  @mousemove="mousemove($event)" @mouseout="mouseout"  @keydown.space="spaceKeyDown($event)" @keyup.space="spaceKeyUp"></canvas>
  </div>
</template>
<script>
import EventModel from './EventModel'
import Element from './Element'
export default {
  props: {
    scale: {
      default: 1.0,
      type: Number
    }
  },
  data: () => {
    return {
      // 全局缩放
      range: 5000,
      globalScale: 0,
      globalTranslateX: 0,
      globalTranslateY: 0,
      // 是否按下空格键
      spaceDown: false,
      axisctx: '',
      gridctx: '',
      Axis_margin: 30
    }
  },
  watch: {
    scale(newval) {
      this.globalScale = this.scale
      this.init()
      this.correctDxy()
      this.render()
    }
  },
  methods: {
    // 把windows坐标转成canvas坐标
    windowToCanvas(canvas, x, y) {
      let bbox = canvas.getBoundingClientRect()
      return {
        x: x - bbox.left * (canvas.width / bbox.width),
        y: y - bbox.top * (canvas.height / bbox.height)
      }
    },
    // 纠正偏移量
    correctDxy() {
      let maxTranslateX = this.range - this.mainctx.canvas.width
      if (this.globalTranslateX < -maxTranslateX) {
        this.globalTranslateX = -maxTranslateX
      }
      if (this.globalTranslateX > 0) {
        this.globalTranslateX = 0
      }
      let maxTranslateY = this.range - this.mainctx.canvas.height
      if (this.globalTranslateY < -maxTranslateY) {
        this.globalTranslateY = -maxTranslateY
      }
      if (this.globalTranslateY > 0) {
        this.globalTranslateY = 0
      }
    },
    mousemove(e) {
      if (this.spaceDown) {
        if (!this.firstPoint) {
          this.firstPoint = {
            x: e.pageX,
            y: e.pageY
          }
        } else {
          let delta = {
            x: e.pageX - this.firstPoint.x,
            y: e.pageY - this.firstPoint.y
          }
          this.globalTranslateX += delta.x * this.globalScale
          this.globalTranslateY += delta.y * this.globalScale
          this.correctDxy()
          this.firstPoint = {
            x: e.pageX,
            y: e.pageY
          }
          this.render()
        }
      }
    },
    mouseout() {
      this.firstPoint = null
      this.spaceDown = false
      this.gridcanvas.style.cursor = 'default'
      this.gridcanvas.blur()
    },
    mouseenter(event) {
      this.gridcanvas.focus()
    },
    // 空格键按下事件
    spaceKeyDown(event) {
      this.spaceDown = true
      this.gridcanvas.style.cursor = 'move'
    },
    spaceKeyUp() {
      this.firstPoint = null
      this.spaceDown = false
      this.gridcanvas.style.cursor = 'default'
    },
    drawGrid() {
      let stepx = 20
      let stepy = 20
      let maxX = this.range
      let maxY = this.range
      this.gridctx.save()
      this.gridctx.strokeStyle = 'lightgray'
      this.gridctx.lineWidth = 0.5
      for (let i = stepx + 0.5; i < maxX; i += stepx) {
        this.gridctx.beginPath()
        this.gridctx.moveTo(i, 0)
        this.gridctx.lineTo(i, maxY)
        this.gridctx.stroke()
      }
      for (let i = stepy + 0.5; i < maxY; i += stepy) {
        this.gridctx.beginPath()
        this.gridctx.moveTo(0, i)
        this.gridctx.lineTo(maxX, i)
        this.gridctx.stroke()
      }
      this.gridctx.restore()
    },
    drawViewPortAxes() {
      let Axis_origin = {
        x: this.Axis_margin,
        y: this.Axis_margin
      }
      let Axis_top = this.Axis_margin
      let Axis_right = this.range + this.Axis_margin
      let Axis_bottom = this.range + this.Axis_margin
      let Axis_width = Axis_right - Axis_origin.x
      let Axis_height = Axis_bottom - Axis_origin.y

      let Tick_space = 20
      let Tick_width = this.Axis_margin
      let Ticks_lineWidth = 0.5
      let Num_Vertaical_Ticks = Axis_height / Tick_space
      let Num_Horizontal_Ticks = Axis_width / Tick_space
      let Ticks_color = 'navy'
      let Axis_color = '#b8b8b8'
      let Axis_lineWidth = 1.0

      this.axisctx.save()
      this.axisctx.strokeStyle = Axis_color
      this.axisctx.lineWidth = Axis_lineWidth
      // H Axis
      this.axisctx.beginPath()
      this.axisctx.moveTo(0, Axis_origin.y)
      this.axisctx.lineTo(Axis_right, Axis_origin.y)
      this.axisctx.stroke()

      // V Axis
      this.axisctx.beginPath()
      this.axisctx.moveTo(Axis_origin.x, 0)
      this.axisctx.lineTo(Axis_origin.x, Axis_bottom)
      this.axisctx.stroke()

      this.axisctx.strokeStyle = Ticks_color
      this.axisctx.lineWidth = Ticks_lineWidth
      this.axisctx.restore()
      // V Tick
      this.axisctx.save()
      this.axisctx.translate(0, this.globalTranslateY)
      let deltaX
      for (let i = 1; i < Num_Vertaical_Ticks; ++i) {
        this.axisctx.beginPath()
        if (i % 10 === 0) {
          deltaX = Tick_width
        } else {
          deltaX = Tick_width / 3
        }
        // 文本
        if (deltaX === Tick_width) {
          this.axisctx.save()
          this.axisctx.translate(0, Axis_origin.y + i * Tick_space)
          this.axisctx.rotate(Math.PI / 180 * -90)
          this.axisctx.font = '14px Arial'
          this.axisctx.fillStyle = 'black'
          this.axisctx.textAlign = 'start'
          this.axisctx.textBaseline = 'middle'
          this.axisctx.fillText(i * Tick_space, 5, 10)
          this.axisctx.restore()
        }

        this.axisctx.moveTo(Axis_origin.x, Axis_origin.y + i * Tick_space + 0.5)
        this.axisctx.lineTo(Axis_origin.x - deltaX, Axis_origin.y + i * Tick_space + 0.5)
        this.axisctx.stroke()
      }
      this.axisctx.restore()
      // H Tick

      this.axisctx.save()
      this.axisctx.translate(this.globalTranslateX, 0)
      let deltaY
      for (let i = 1; i < Num_Horizontal_Ticks; ++i) {
        this.axisctx.beginPath()
        if (i % 10 === 0) {
          deltaY = Tick_width
        } else {
          deltaY = Tick_width / 3
        }
        // 文本
        if (deltaY === Tick_width) {
          this.axisctx.save()
          this.axisctx.translate(Axis_origin.x + i * Tick_space, 0)
          this.axisctx.font = '14px Arial'
          this.axisctx.fillStyle = 'black'
          this.axisctx.textAlign = 'start'
          this.axisctx.textBaseline = 'middle'
          this.axisctx.fillText(i * Tick_space, 5, 10)
          this.axisctx.restore()
        }
        this.axisctx.moveTo(Axis_origin.x + i * Tick_space + 0.5, Axis_origin.y)
        this.axisctx.lineTo(Axis_origin.x + i * Tick_space + 0.5, Axis_origin.y - deltaY)
        this.axisctx.stroke()
      }
      this.axisctx.restore()
    },
    render() {
      this.axisctx.setTransform(1, 0, 0, 1, 0, 0)
      this.axisctx.clearRect(0, 0, this.axisctx.canvas.width, this.axisctx.canvas.height)
      this.drawViewPortAxes()

      this.renderMain()
      this.gridctx.setTransform(1, 0, 0, 1, 0, 0)

      this.gridctx.clearRect(0, 0, this.gridctx.canvas.width, this.gridctx.canvas.height)
      this.gridctx.translate(this.globalTranslateX, this.globalTranslateY)
      this.drawGrid()
    },
    renderMain() {
      this.mainctx.setTransform(1, 0, 0, 1, 0, 0)
      this.mainctx.clearRect(0, 0, this.mainctx.canvas.width, this.mainctx.canvas.height)
      this.mainctx.translate(this.globalTranslateX, this.globalTranslateY)
      //   this.children.forEach(item => {
      //     item.render(this.mainctx)
      //   })
      this.mainctx.beginPath()
      this.mainctx.arc(300, 190, 150, 0, Math.PI * 2, false)
      this.mainctx.arc(300, 190, 100, 0, Math.PI * 2, true)
      this.mainctx.fill()
      //   this.mainctx.stroke()
      //   this.mainctx.beginPath()
      //   this.mainctx.lineWidth = 10
      //   this.mainctx.strokeStyle = 'red'
      //   this.mainctx.rect(200, 200, 300, 300)
      //   this.mainctx.stroke()
    },
    init() {
      this.axiscanvas.width = this.$el.clientWidth / this.globalScale
      this.axiscanvas.height = this.$el.clientHeight / this.globalScale
      this.gridcanvas.style.top = this.Axis_margin * this.globalScale + 'px'
      this.gridcanvas.style.left = this.Axis_margin * this.globalScale + 'px'
      this.gridcanvas.style.width = this.$el.clientWidth - this.Axis_margin * this.globalScale + 'px'
      this.gridcanvas.style.height = this.$el.clientHeight - this.Axis_margin * this.globalScale + 'px'
      this.gridcanvas.width = (this.$el.clientWidth - this.Axis_margin * this.globalScale) / this.globalScale
      this.gridcanvas.height = (this.$el.clientHeight - this.Axis_margin * this.globalScale) / this.globalScale
      this.maincanvas.style.top = this.gridcanvas.style.top
      this.maincanvas.style.left = this.gridcanvas.style.left
      this.maincanvas.style.width = this.gridcanvas.style.width
      this.maincanvas.style.height = this.gridcanvas.style.height
      this.maincanvas.width = this.gridcanvas.width
      this.maincanvas.height = this.gridcanvas.height
    }
  },
  created() {
    this.globalScale = this.scale
  },
  mounted() {
    this.children = []
    this.children.push(new Element(0, 0, 100, 100))
    this.axiscanvas = this.$el.querySelector('.axis')
    this.gridcanvas = this.$el.querySelector('.grid')
    this.maincanvas = this.$el.querySelector('.main')
    this.axisctx = this.axiscanvas.getContext('2d')
    this.gridctx = this.gridcanvas.getContext('2d')
    this.mainctx = this.maincanvas.getContext('2d')
    this.eventModel = new EventModel(this.gridcanvas)
    this.gridcanvas.focus()
    this.init()
    this.render()
    window.onresize = () => {
      this.init()
      this.render()
    }
  }
}
</script>
<style scoped lang='less'>
.stage {
  width: 100%;
  height: 100%;
  position: relative;
  .axis {
    width: 100%;
    height: 100%;
  }
}
.grid,
.main {
  position: absolute;
  top: 30px;
  bottom: 0px;
  left: 30px;
  right: 0px;
  &:focus {
    outline: none;
  }
}
</style>
