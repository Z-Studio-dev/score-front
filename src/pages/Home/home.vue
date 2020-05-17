<template>
  <div id="app" class="note" :style="note" @scroll="scrollGet($event)">
    <router-view />
    <div id="nav" >
      <!--        <div id="top"></div>-->
      <ul>
        <li><a href="#banner" class="nav-underline">首页</a></li>
        <li><a href="#fraction" class="nav-underline">分数详情</a></li>
        <li><a href="#classroom" class="nav-underline">班级</a></li>
        <li><a href="#record" class="nav-underline">日志</a></li>
        <li v-if="username==null||username=='undefined'||username==''"><a style="cursor:pointer;" @click="hrefLogin()" class="nav-underline">登录</a></li>
        <li v-else>
          <div class="userbtn">
            <i class="layui-icon" style="font-size: 22px;position: absolute;color: #FFF;">&#xe66f;</i>
            <div class="userbtndown">
            <div id="userbtn_down_box">
              <div class="triangle"></div>
              <div style="" class="user_avatar_main" >
                <div class="avatar"></div>
                <p style="margin-top: 20px" v-text="nickname"></p>
              </div>
              <div class="user_main">账号资料</div>
              <div @click="logout()" class="user_main">退出</div>
            </div></div>
          </div>
        </li>
      </ul>
    </div>
    <div id="banner">
      <div class="title">
        <span>Title</span>
        <div></div>
        <p>/* 这是一个简易的加分系统 */</p>
      </div>
      <div class="arrow"><a href="#fraction"></a></div>
    </div>
    <div id="fraction">
      <div class="title">
        <span>分数详情</span>
        <div></div>
      </div>
      <div class="fraction_box">// TODO  分数可视化</div>
    </div>
    <div id="classroom">
      <div class="title">
        <span>班级</span>
        <div></div>
      </div>
      <div class="content">
        <div v-for="classDatail in classDatails">
        <div class="class_box" @click="hrefClass(classDatail.classname)">
          <div class="class_box_content">
            <p class="class_box_title" v-text="classDatail.classname"></p>
            <div class="class_box_details">
              <p>方向：<span v-text="classDatail.profession"></span></p>
              <p>总人数：<span v-text="countStudent(classDatail.classname)"></span></p>
            </div>
          </div>
        </div></div>
      </div>
    </div>
    <div id="record">
      <div class="title">
        <span>小站大事记</span>
        <div></div>
      </div>
    </div>
    <div id="bottom">

    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  export default {
    name: 'app',
    data() {
      return {
        note: {
          backgroundImage: "url(" + require("../../../static/images/VancouverFall_ZH-CN9824386829_1920x1080.jpg") + ")",
        },
        username: '',
        nickname: '',
        sex: '',
        file: '',
        role_id: 0,
        token: '',
        scr: 0,
        fraction: 0,
        classname:'',
        classDatails: [],
        studentCount: 0
      }
    },
    created() {
      let self = this;
      this.token = sessionStorage.getItem('token');
      if(this.token != '' || this.token != null) {
        $.ajax({
          url: 'http://localhost:8848/user/checklogin',
          type: 'GET',
          data: {
            'token': self.token
          },
          dataType: 'json'
        }).then(function (data) {
          self.username = data.result.username;
          self.nickname = data.result.nickname;
          self.sex = data.result.sex;
          self.file = data.result.file;
          self.role_id = data.result.role_id;
        }).fail(function () {
          layer.msg('请求失败，请重试',{icon: 2,time:1000});
        });
      }
    },
    updated() {
      let self = this;
      if(this.role_id == 1||this.role_id == 3) {  // 学生
        setTimeout(function () {
          $.ajax({
            url: 'http://localhost:8848/student/username',
            type: 'GET',
            data: {
              'username': self.username
            },
            dataType: 'json',
            success: function (data) {
              self.classname = data.result.inclass;
              self.fraction = data.result.fraction;
            },
            error: function (data) {
              console.log('失败');
            }
          });
        },500);
      }
      if(this.role_id == 2){  //教师
        setTimeout(function () {
          $.ajax({
            url: 'http://localhost:8848/teacher/username',
            type: 'GET',
            data: {
              'username': self.username
            },
            dataType: 'json',
            success: function (data) {
              self.classname = data.result.management_class;
            },
            error: function (data) {
              console.log('失败');
            }
          });
        },500);
      }
    },
    mounted() {
      let self =this;
      setTimeout(function () {
        $.ajax({
          url: 'http://localhost:8848/class/classname',
          type: 'GET',
          data: {
            'classNames': self.classname
          },
          dataType: 'json',
          success: function (data) {
            self.classDatails = data.result;
          },
          error: function (data) {
            console.log('失败');
          }
        });
      },1000);
      layui.use(['form', 'layer','jquery'],
        function() {
          var form = layui.form,
            layer = layui.layer;

        });
      setTimeout(function () {
        L2Dwidget.init({
          "model": {
            jsonPath: "https://unpkg.com/live2d-widget-model-hijiki@1.0.5/assets/hijiki.model.json",
            "scale": 1
          },
          "display": {
            "position": "right",
            "width": 90,
            "height": 150,
            "hOffset": 10,
            "vOffset": -20
          },
          "mobile": {
            "show": true,
            "scale": 0.5
          },
          "react": {
            "opacityDefault": 0,
            "opacityOnHover": 0
          }
        });
      },2000)

    },
    methods:{
      countStudent: function(className) {
        let self = this;
        let counts = 0;
        $.ajax({
          url: 'http://localhost:8848/student/count/class',
          type: 'GET',
          async: false,
          data: {
            'className': className
          },
          dataType: 'json',
          success: function (data) {
            self.counts = data;
          },
          error: function (data) {
            console.log('失败');
          }
        });
        return self.counts;
      },
      hrefLogin: function () {
        this.$router.push({path:'/login'})
      },
      hrefClass: function(className) {
        this.$router.push({path:'/class',query:{classname:className}})
      },
      scrollGet (e) {
        let scr = e.target.scrollTop;
        if (scr > 800) {
          $("#nav").css("position","fixed");
          $("#nav").removeClass("navFalse");$("#nav").addClass("navTrue");
          $(".nav-underline").css("color","#3F3F3F");
          $(".layui-icon").css("color","#3F3F3F");
        } else {
          $("#nav").css("position","absolute");
          $("#nav").removeClass("navTrue");$("#nav").addClass("navFalse");
          $(".nav-underline").css("color","#FFF");
          $(".layui-icon").css("color","#FFF");
        }
      },
      logout:function () {
        let self = this;
        $.ajax({
          url: 'http://localhost:8848/user/logout',
          type: 'GET',
          data: {
            'token': self.token
          },
          dataType: 'json',
          success: function (data) {
          },
          error: function (data) {
            layer.msg('退出失败',{icon: 2,time:1000});
          }
        });
        location.reload();
      },
    }
  }
</script>

<style scoped>
  @import "../../assets/style/style.css";
</style>
