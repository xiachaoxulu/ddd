<template>
    <ul class="type-wrapper">
        <li  v-for="type in types" :class="{select:currentSelect===type}" @click='changeSelect(type)'><a href="javascript:void(0)">{{type}}</a></li>
    </ul>
</template>
<script>
export default {
  data: () => {
    return {
      types: [
        'People',
        'Head',
        'BobyUp',
        'BodyDown',
        'ArmLeft',
        'ArmRight',
        'HandLeft',
        'HandRight',
        'LegLeft',
        'LegRight',
        'ShankLeft',
        'ShankRight',
        'FootLeft',
        'FootRight'
      ],
      currentSelect: ''
    }
  },
  props: {
    defalutSelect: {
      default: '',
      type: String
    }
  },
  methods: {
    changeSelect(type) {
      if (type !== this.currentSelect) {
        this.$emit('changeSelect', type)
        this.currentSelect = type
      }
    }
  },
  watch: {
    defalutSelect(newval, oldval) {
      this.changeSelect(newval)
    }
  },
  created() {
    this.currentSelect = this.defalutSelect
  }
}
</script>
<style lang='less' scoped>
.type-wrapper {
  padding-top: 20px;
  list-style: none;
  li {
    cursor: pointer;
    padding-left: 40px;
    line-height: 30px;
    text-align: left;
    a {
      text-decoration: none;
    }
  }
  li.select {
    background-color: #619ce0;
    a {
      color: white;
    }
  }
}
</style>
