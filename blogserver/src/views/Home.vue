<template>
  <div class="home">
    <base-index />
  </div>
</template>

<script>
import baseIndex from './index'
export default {
  name: 'Home',
  components: {
    baseIndex
  }
}

</script>

<style lang="less">
::selection{
  background-color: salmon;
  color: #fff;
}
.my_popUp{
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    top: 50px;
    z-index: 100;
    width: 300px;
    line-height: 24px;
    padding: 10px 10px;
    box-sizing: border-box;
    text-align: center;
    color: #fff;
    font-weight: bold;
    font-size: 18px;
    background-color: rgb(254, 106, 0);
    border-radius: 5px;
    border: 1px solid rgb(220, 131, 110);
    box-shadow: 1px 1px 5px rgba(255, 71, 38, .3);
    opacity: 0.92;
    &.hideStyle{
        transform: translateY(-100px);
        transition-duration: 1s;
        transition-delay: .3s;
        opacity: 0;
    }
}
</style>