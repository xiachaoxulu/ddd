<template>
  <div class="editor-wrapper">
      <div class="tools-wrapper">
         <div class="magnifie">
             <a class="sub" href="javascript:void(0)" @click="magnifiesub">-</a>
             <div class="img" @click="magnifieclear">
                 <img src="./assets/magnifie.png" alt=""/>
                 <p>{{scale*100+'%'}}</p>
             </div>
             <a class="plus" href="javascript:void(0)"  @click="magnifieplus">+</a>
         </div>
      </div>
      <div class="nav-wrapper">
          <skeleton-type  @changeSelect='skeletonTypeSelectChange'></skeleton-type>
      </div>
      <div class="stage-wrapper">
          <stage :scale="scale"></stage>
      </div>
      <div class="propety-wrapper"></div>
      <div class="timeline-wrapper"></div>
  </div>
</template>

<script>
import skeletonType from './components/skeletonType'
import stage from './components/stage'
export default {
  name: 'App',
  data: () => {
    return {
      scale: 1,
      currentSelectSkeletonType: ''
    }
  },
  methods: {
    magnifieclear() {
      this.scale = 1
    },
    magnifiesub() {
      this.scale -= 0.5
      if (this.scale < 0.5) {
        this.scale = 0.5
      }
    },
    magnifieplus() {
      this.scale += 0.5
      if (this.scale > 4) {
        this.scale = 4
      }
    },
    skeletonTypeSelectChange(type) {
      this.currentSelectSkeletonType = type
    }
  },
  components: {
    skeletonType,
    stage
  }
}
</script>

<style lang='less'>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html,
body {
  height: 100%;
  min-width: 1200px;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.editor-wrapper {
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
}
.tools-wrapper,
.nav-wrapper,
.stage-wrapper,
.propety-wrapper,
.timeline-wrapper {
  position: absolute;
}
.nav-wrapper {
  left: 0;
  top: 70px;
  border-right: 1px solid #b8b8b8;
  width: 150px;
  bottom: 150px;
  background-color: #ececec;
}
.tools-wrapper {
  height: 70px;
  border-bottom: 1px solid #b8b8b8;
  width: 100%;
  background-color: #e4e2e4;
  display: flex;
  align-items: center;
  justify-content: center;
  .magnifie {
    display: flex;
    align-items: center;
    justify-content: center;
    .img {
      width: 30px;
      display: flex;
      flex-flow: column;
      font-size: 14px;
      margin: 0px 10px;
      img {
        height: 100%;
        width: 100%;
      }
    }
    .sub,
    .plus {
      text-decoration: none;
      cursor: pointer;
      display: inline-block;
      height: 40px;
      width: 30px;
      font-size: 24px;
      line-height: 40px;
    }
  }
}
.stage-wrapper {
  top: 70px;
  left: 150px;
  right: 150px;
  bottom: 150px;
  background-color: #fff;
}
.propety-wrapper {
  top: 70px;
  right: 0px;
  bottom: 150px;
  width: 150px;
  border-left: 1px solid #b8b8b8;
  background-color: #e4e2e4;
}
.timeline-wrapper {
  height: 150px;
  bottom: 0px;
  width: 100%;
  border-top: 1px solid #b8b8b8;
  background-color: #e4e2e4;
}
</style>
