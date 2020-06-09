<template>
  <div id="app" class="note" :style="note">
    <div id="banner">
      <div class="content">
        <p v-text="classname"></p>
        <p v-text="class_description"></p>
      </div>
    </div>
    <div id="main">
      <div class="back" @click="back()" @mousemove="backMove()" @mouseleave="backLeave()">
        <div class="arrow"></div>
        <p>返回</p>
      </div>
      <div class="content">
        <div class="layui-card-body layui-table-body layui-table-main">
          <table class="layui-table layui-form" style="table-layout:fixed" lay-filter="test">
            <thead>
            <tr>
              <th style="background-color: #767575;color: #FFF">学号
                <span class="layui-table-sort layui-inline" id="id_sort" lay-sort="{$id_sort}">
                  <i @click="sort_asc('id')" class="layui-edge layui-table-sort-asc" title="升序"></i>
                  <i @click="sort_desc('id')" class="layui-edge layui-table-sort-desc" title="降序"></i>
                </span>
              </th>
              <th style="background-color: #767575;color: #FFF">昵称</th>
              <th style="background-color: #767575;color: #FFF">总分数
                <span class="layui-table-sort layui-inline" id="fraction_sort" lay-sort="{$id_sort}">
                  <i @click="sort_asc('fraction')" class="layui-edge layui-table-sort-asc" title="升序"></i>
                  <i @click="sort_desc('fraction')" class="layui-edge layui-table-sort-desc" title="降序"></i>
                </span>
              </th>
              <th style="background-color: #767575;color: #FFF;width: 120px;" v-if="user.role_id==2||user.role_id==3">操作</th>
              <th style="background-color: #767575;color: #FFF;width: 80px;" v-if="user.role_id==2">班级管理员</th>
            </tr>
            </thead>
            <tbody v-for="datail in datails">
              <tr :class="datail.username===user.username?'myfraction':''">
                <td v-text="datail.username"></td>
                <td v-text="datail.nickname"></td>
                <td v-text="datail.fraction"></td>
                <td v-if="user.role_id==2||user.role_id==3">
                  <button @click="addPoints(datail.id, datail.fraction, datail, datail.nickname)" type="button" class="layui-btn layui-btn-sm layui-btn-normal">+</button>
                  <button @click="minusPoints(datail.id, datail.fraction, datail, datail.nickname)" type="button" class="layui-btn layui-btn-sm layui-btn-normal">-</button>
                  <input :id="'scoreInput'+datail.id" type="text" name="fraction_text" autocomplete="off" class="fraction_inputText">
                </td>
                <td style="text-align: center" v-if="user.role_id==2">
                  <span :id="'roleSpan'+datail.id" v-if="datail.role_id == 3" @click="studentRole(datail.id, datail.username, datail.nickname)" style="cursor: pointer" class="layui-btn layui-btn-normal layui-btn-mini" title="启用中">True</span>
                  <span :id="'roleSpan'+datail.id" v-if="datail.role_id == 1" @click="studentRole(datail.id, datail.username, datail.nickname)" style="cursor: pointer" class="layui-btn layui-btn-disabled layui-btn-normal layui-btn-mini" title="未启用">False</span>
                </td>
              </tr>
            </tbody>
          </table>
          <div align="center" id="Pagination"></div>
        </div>
      </div>
      <div class="bottom">
        <div class="bottom_btn">
          <div class="bottom_back" @click="back()">< 返回首页</div>
          <div class="bottom_fraction" @click="show($event, '分数详情', 'http://localhost:8080/#/class/personalFraction')">分数详情 ></div>
        </div>
      </div>
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
        datails: [],
        start: 1,
        pagesize: 20,
        count: 0,
        filterCount: 0,
        classname: '',
        class_description: '',
        user: {
          username: '',
          nickname: '',
          role_id: ''
        },
        screenWidth: 1920,
      }
    },
    created() {
      let self = this;
      let recordsTotal = 0;
      this.token = sessionStorage.getItem('token');

      // 用户信息
      if(this.token != '' || this.token != null) {
        $.ajax({
          url: 'http://localhost:8848/user/checklogin',
          type: 'GET',
          data: {
            'token': self.token
          },
          dataType: 'json'
        }).then(function (data) {
          self.user.username = data.result.username;
          self.user.nickname = data.result.nickname;
          self.user.role_id = data.result.role_id;
        }).fail(function () {
          layer.msg('请求失败，请重试',{icon: 2,time:1000});
        });
      }

      // 获得所在班级
      $.ajax({
        url: 'http://localhost:8848/class/classname',
        type: 'GET',
        data: {
          'classNames': self.$route.query.classname
        },
        dataType: 'json',
        success: function (data) {
          self.classname = data.result[0].classname;
          self.class_description = data.result[0].description;
        },
        error: function (data) {
          console.log('失败');
        }
      });
      // 获得所在班级所有的学生信息
      this.getAllStudent(self, 'fraction', 'desc', recordsTotal);

      setTimeout(() => {
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
            "opacityDefault": 0.9,
            "opacityOnHover": 0.2
          }
        });
      }, 1000)
    },
    mounted() {
      layui.use(['form', 'layer', 'jquery'],
        function() {
          var form = layui.form,
            layer = layui.layer;
          form.render();
        });
      this.screenWidth = document.body.clientWidth;
      window.onresize = () => {
        return (() => {
          this.screenWidth = document.body.clientWidth;
        })();
      };
    },
    watch:{
      screenWidth(val){
        if(!this.timer){
          this.screenWidth = val;
          this.timer = true;
          let _this = this;
          setTimeout(function () {
            if(_this.screenWidth < 1300){
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
                  "opacityDefault": 0.0,
                  "opacityOnHover": 0.0
                }
              });
            }else{
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
                  "opacityDefault": 0.9,
                  "opacityOnHover": 0.2
                }
              });
            }
            _this.timer = false;
          }, 1000);
        }
      }
    },
    methods: {
      getAllStudent: function (self, sortColumn, sort, recordsTotal) {
        $.ajax({
          url: 'http://localhost:8848/student/list/classname',
          type: 'GET',
          async : false,
          data: {
            draw: 1,
            start: self.start,
            length: self.pagesize,
            className: self.$route.query.classname,
            sort: sort,
            sortColumn: sortColumn
          },
          dataType: 'json'
        }).then(function (msg) {
          self.datails = msg.data;
          self.count = msg.recordsTotal;
          self.filterCount = msg.recordsFiltered;
          recordsTotal = msg.recordsTotal;
        }).fail(function () {
          console.log('失败');
        });
        setTimeout(function () {
          self.layuiPage(recordsTotal, self.pagesize, self, self.$route.query.classname, sort, sortColumn);
        }, 1000)
      },
      layuiPage(total, pageSize, self, classname, sort, sortColumn){
        layui.use(['laypage', 'layer'], function(){
          var laypage = layui.laypage
            ,layer = layui.layer;

          laypage.render({
            elem: 'Pagination',
            count: total,
            layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
            limit: pageSize,
            theme: '#1E9FFF',
            jump: function(obj, first) {
              if(!first) {
                $.ajax({
                  url: 'http://localhost:8848/student/list/classname',
                  type: 'get',
                  data: {
                    draw: 1,
                    start: obj.curr,
                    length: obj.limit,
                    className: classname,
                    sort: sort,
                    sortColumn: sortColumn
                  },
                  dataType: 'json'
                }).then(function (msg) {
                  //把从json获取的数据赋值给数组
                  self.datails = msg.data;
                  self.count = msg.recordsTotal;
                }).fail(function () {
                  console.log('失败');
                });
              }
            }
          });
        });
      },
      addPoints: function(id, fraction, _this, nickname){
        let score = $('#scoreInput'+id).val();
        let that = this;
        if(score == null || score == '') {
          $.ajax({
            url: 'http://localhost:8848/student/fraction',
            type: 'PUT',
            data: {
              'id': id,
              'fraction': fraction + 1,
              'operator': that.user.nickname
            },
            dataType: 'json',
            success: function (data) {
              _this.fraction = data.result.fraction;
            },
            error: function (data) {
              console.log('失败');
            }
          });
        }else {
          let str = "确认要给"+nickname+"加"+score+"分吗？";
          layer.confirm(str, {
            btn : [ '确定', '取消' ]//按钮
          }, function(index) {
            $.ajax({
              url: 'http://localhost:8848/student/fraction',
              type: 'PUT',
              data: {
                'id': id,
                'fraction': parseInt(fraction) + parseInt(score),
                'operator': that.user.nickname
              },
              dataType: 'json',
              success: function (data) {
                _this.fraction = data.result.fraction;
                layer.close(index);
                layer.msg('加分成功',{icon: 1,time:1000});
                $('#scoreInput'+id).val('');
              },
              error: function (data) {
                console.log('失败');
              }
            });
          });
        }
      },
      minusPoints: function(id, fraction, _this, nickname){
        let score = $('#scoreInput'+id).val();
        let that = this;
        if(score == null || score == '') {
          $.ajax({
            url: 'http://localhost:8848/student/fraction',
            type: 'PUT',
            data: {
              'id': id,
              'fraction': fraction - 1,
              'operator': that.user.nickname
            },
            dataType: 'json',
            success: function (data) {
              _this.fraction = data.result.fraction;
            },
            error: function (data) {
              console.log('失败');
            }
          });
        }else {
          let str = "确认要给"+nickname+"减"+score+"分吗？";
          layer.confirm(str, {
            btn : [ '确定', '取消' ]//按钮
          }, function(index) {
            $.ajax({
              url: 'http://localhost:8848/student/fraction',
              type: 'PUT',
              data: {
                'id': id,
                'fraction': parseInt(fraction) - parseInt(score),
                'operator': that.user.nickname
              },
              dataType: 'json',
              success: function (data) {
                _this.fraction = data.result.fraction;
                layer.close();
                layer.msg('减分成功',{icon: 1,time:1000});
                $('#scoreInput'+id).val('');
              },
              error: function (data) {
                console.log('失败');
              }
            });
          });
        }

      },
      studentRole: function(id, username, nickname) {
        let _this = this;
        if($("#roleSpan"+id).attr('title') == "启用中"){
          let str = "确定取消" + nickname + "的管理资格吗？"
          layer.confirm(str, {
            btn : [ '确定', '取消' ]//按钮
          }, function(index) {
            $.ajax({
              url: 'http://localhost:8848/student/manager',
              type: 'PUT',
              data: {
                'id': id,
                'roleId': 1
              },
              dataType: 'json',
              success: function (data) {
                layer.close(index);
                _this.updateUserRole(username, 1);
                layer.msg('设置成功',{icon: 1,time:1000});
                $("#roleSpan"+id).attr('title','未启用');
                $("#roleSpan"+id).addClass('layui-btn-disabled').html('False');
              },
              error: function (data) {
                layer.close(index);
                layer.msg('设置失败',{icon: 2,time:1000});
              }
            });
          });
        }
        if($("#roleSpan"+id).attr('title') == "未启用"){
          let str = "确定将" + nickname + "设置为班级管理员吗？"
          layer.confirm(str, {
            btn : [ '确定', '取消' ]//按钮
          }, function(index) {
            $.ajax({
              url: 'http://localhost:8848/student/manager',
              type: 'PUT',
              data: {
                'id': id,
                'roleId': 3
              },
              dataType: 'json',
              success: function (data) {
                layer.close(index);
                _this.updateUserRole(username, 3);
                layer.msg('设置成功',{icon: 1,time:1000});
                $("#roleSpan"+id).attr('title','启用中');
                $("#roleSpan"+id).removeClass('layui-btn-disabled').html('True');
              },
              error: function (data) {
                layer.close(index);
                layer.msg('设置失败',{icon: 2,time:1000});
              }
            });

          });
        }
      },
      updateUserRole: function(username, roleId) {
        $.ajax({
          url: 'http://localhost:8848/user/role',
          type: 'PUT',
          async : false,
          data: {
            'username': username,
            'roleId': roleId
          },
          dataType: 'json',
          success: function (data) {

          },
          error: function (data) {
          }
        });
      },
      sort_asc: function(sortColumn) {
        this.getAllStudent(this, sortColumn, 'asc', this.count);
      },
      sort_desc: function(sortColumn) {
        this.getAllStudent(this, sortColumn, 'desc', this.count);
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
      },
      show: function (e, title, content) {
        var that = this;
        //多窗口模式，层叠置顶
        layer.open({
          type: 2 //此处以iframe举例
          ,title: title
          ,area: ['50%', '550px']
          ,shade: 0.4
          ,maxmin: true
          ,minwidth: 800
          ,content: content + '?classname=' + that.classname
          // ,data: that.classname
          ,yes: function(){
            $(that).click();
          }
          ,btn2: function(){
            layer.closeAll();
          }
        });
      },
    }
  }
</script>
<style scoped>
  @import "../../assets/style/fraction.css";
</style>
