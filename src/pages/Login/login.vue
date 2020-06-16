<template>
  <div id="app" class="note" :style="note">
    <router-view/>
    <div id="box">
      <div id="main" class="animate__animated animate__bounceIn">
        <div class="back" @click="back()" @mousemove="backMove()" @mouseleave="backLeave()">
          <div class="arrow"></div>
          <p>返回</p>
        </div>
        <div class="logo">
          <img src="../../../static/images/score_icon.png">
        </div>
        <div class="title">登录</div>
        <div class="content">
          <form class="layui-form" action="">
            <input type="text" name="username" lay-verify="username" placeholder="账号">
            <input type="password" name="pass" lay-verify="pass" placeholder="密码">
            <div style="margin-top: 5px" class="layui-form-item" pane="">
              <input type="checkbox" name="rememberPwd" lay-skin="primary" title="记住密码">
              <a href="#" class="forgetPwd">忘记密码？</a>
            </div>
            <div class="btn" @click="login()" lay-filter="loginFilter" >登录</div></form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import { setStorage, getStorage, removeStorage } from '../../util/storage'
  export default {
    name: 'Login',
    data() {
      return {
        note: {
          backgroundImage: "url(" + require("../../../static/images/login_bg.jpg") + ")",
        }
      }
    },
    created() {

    },
    mounted() {
      layui.use(['form', 'layer','jquery'],
        function() {
          var form = layui.form,
            layer = layui.layer;
          form.render();

          //自定义验证规则
          form.verify({
            username: function(value) {
              if (value.length <= 0) {
                return '用户名不能为空';
              }
            },
            pass: function(value) {
              if (value.length <= 0) {
                return '密码不能为空';
              }
            },
          });
        });
    },
    updated() {
      form.render();
    },
    methods: {
      login: function () {
        let self = this;
        let username = $("input[name='username']").val();
        let password = $("input[name='pass']").val();
        $.ajax({
          url: 'http://localhost:8848/user/login',
          type: 'POST',
          contentType: 'application/json',
          dataType: 'json',
          data: JSON.stringify({
            'userName': username,
            'userPwd': password
          }),
          success: function (data) {
            if(data.result.username == '' || data.result.username == null) {
              layer.msg('登录失败 '+data.result.message,{icon: 2,time:1000});
            }else {
              if($("input[name='rememberPwd']").prop("checked")){
                setStorage('remember', 'true');
                setStorage('rusername', username);
                setStorage('rpassword', password);
              }else {
                setStorage('remember', 'false');
                removeStorage('rusername');
                removeStorage('rpassword');
              }
              layer.msg(data.result.message+' 正在自动跳转...',{icon: 1,time:1500});
              setTimeout(function () {
                sessionStorage.setItem('token', data.result.token);
                self.$router.push({path: '/'});
              }, 1500)
            }
          },
          error: function (data) {
            layer.msg('登录失败 '+data.result.message,{icon: 2,time:1000});
          }
        });
      },
      backMove: function () {
        $(".back p").css("animation","back_p_move .5s forwards");
        $(".back .arrow").css("animation","back_arrow_move .5s forwards");
      },
      backLeave: function () {
        $(".back p").css("animation","back_p_leave .5s forwards");
        $(".back .arrow").css("animation","back_arrow_leave .5s forwards");
      },
      back: function () {
        this.$router.push({path:'/home'});
      }
    }
  }
</script>

<style scoped>
  @import "../../assets/style/login.css";
</style>
