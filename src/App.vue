<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  export default {
    name: 'app',
  }
</script>

<style>
  *{
    margin: 0px;
    padding: 0px;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    list-style-type: none;
  }
  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  ::-webkit-scrollbar
  {
    width: 5px;  /*滚动条宽度*/
    height: 5px;  /*滚动条高度*/
  }

  /*定义滚动条轨道 内阴影+圆角*/
  ::-webkit-scrollbar-track
  {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    border-radius: 3px;  /*滚动条的背景区域的圆角*/
    background-color: #f5f5f5;/*滚动条的背景颜色*/
  }

  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb
  {
    border-radius: 10px;  /*滚动条的圆角*/
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: #555555;  /*滚动条的背景颜色*/
  }
  a{
    text-decoration: none;
  }
</style>
