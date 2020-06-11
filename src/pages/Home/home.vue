<template>
  <div id="app" class="note" :style="note" @scroll="scrollGet($event)">
    <router-view />
    <div id="nav" >
      <!--        <div id="top"></div>-->
      <div class="logo">Score</div>
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
        <span>上善若水</span>
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
      <div class="fraction_box">
        <div v-if="role_id==1||role_id==3" id="fraction_lineChart" style="width: 100%;height: 370px;"></div>
        <div v-if="role_id==2" class="layui-form" style="position:relative;">
          <!-- 班级平均分折线图 -->
          <div style="width: 100%;height: 370px;float: left" id="fraction_lineChart_avg"></div>
          <!-- 班级选择器 -->
          <div style="width: 230px;position: absolute;right: 0px" class="layui-form-item">
            <div class="layui-input-block">
              <select lay-filter="showClassAvg">
                <option value="" selected=""></option>
                <option :value="classDatail.classname" v-for="classDatail in classDatails" v-text="classDatail.classname"></option>
              </select>
            </div>
          </div>
        </div>
      </div>
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
        <span>日志</span>
        <div></div>
      </div>
      <div class="record_box">
        <div v-if="role_id==2||role_id==3" style="position: relative">
          <button class="layui-btn layui-btn-danger" style="position: absolute;bottom: 20px;left: 15px;z-index: 100" @click="delAllLog()"><i class="layui-icon"></i>批量删除</button>
          <div style="box-shadow: 0px 0px 20px rgba(0,0,0,0.3);" class="layui-card-body layui-table-body layui-table-main">
            <table class="layui-table layui-form" style="table-layout:fixed;" lay-filter="test">
              <thead>
              <tr style="text-align: center">
                <th style="background-color: #767575;color: #FFF;width: 20px">
                  <input type="checkbox" lay-filter="checkall" name="selectAll" lay-skin="primary">
                </th>
                <th style="background-color: #767575;color: #FFF;width: 60px">日志名称</th>
                <th style="background-color: #767575;color: #FFF;width: 90px">学号</th>
                <th style="background-color: #767575;color: #FFF;width: 45px">昵称</th>
                <th style="background-color: #767575;color: #FFF;width: 70px">所在班级</th>
                <th style="background-color: #767575;color: #FFF;width: 50px">分数</th>
                <th style="background-color: #767575;color: #FFF;width: 70px">操作用户</th>
                <th style="background-color: #767575;color: #FFF;width: 90px">IP</th>
                <th style="background-color: #767575;color: #FFF;width: 70px">耗时(毫秒)</th>
                <th style="background-color: #767575;color: #FFF;width: 120px">创建时间</th>
                <th style="background-color: #767575;color: #FFF;width: 30px">操作</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="logDatail in logDatails">
                <td>
                  <input type="checkbox" :id="logDatail.id" :value="logDatail.id" lay-skin="primary">
                </td>
                <td v-text="logDatail.name"></td>
                <td v-text="logDatail.username"></td>
                <td v-text="logDatail.nickname"></td>
                <td v-text="logDatail.inclass"></td>
                <td>
                  {{ logDatail.fraction | splitFraction }}
                  <span v-html="splitChangeFraction(logDatail.fraction)"></span>
                </td>
                <td v-text="logDatail.user"></td>
                <td v-text="logDatail.ip"></td>
                <td v-text="logDatail.time"></td>
                <td>{{ logDatail.createDate | formatDate }}</td>
                <td style="text-align: center;">
                  <a title="彻底删除" @click="delfractionLog(logDatail.id)" href="javascript:;">
                    <i class="layui-icon">&#xe640;</i>
                  </a>
                </td>
              </tr>
              </tbody>
            </table>
            <div align="center" id="Pagination"></div>
          </div>
        </div>
      </div>
    </div>
    <div id="bottom">
    </div>
    <div class="classButton" v-if="role_id == 1 || role_id == 3" v-for="classDatail in classDatails">
      <a href="#" @click="hrefClass(classDatail.classname)">
        <i class="layui-icon">&#xe670;</i>
      </a>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import {formatDate} from "../../util/formatDate"
  export default {
    name: 'app',
    components: {

    },
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
        fraction_change: '',
        classname:'',
        classDatails: [],
        studentCount: 0,
        logDatails: [],
        start: 1,
        pagesize: 10
      }
    },
    created() {
      let self = this;
      let recordsTotal = 0;
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

        // 获得分数日志信息
        this.fractionLog(self, self.start, recordsTotal,"");
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
              self.fraction_change = data.result.fraction_change;
            },
            error: function (data) {
              console.log('失败');
            }
          });
        },500);
        this.lineChart();
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
        this.lineChart_avg();
      }
      layui.use(['form', 'layer','jquery'],
        function() {
          let form = layui.form,
            layer = layui.layer;
          // 监听全选
          form.on('checkbox(checkall)', function(data){

            if(data.elem.checked){
              $('tbody input').prop('checked',true);
            }else{
              $('tbody input').prop('checked',false);
            }
            form.render('checkbox');
          });

          form.on('select(showClassAvg)',function (data) {
            let self = this;
            let classArray = new Array();
            $.ajax({
              url: 'http://localhost:8848/student/list/classname',
              type: 'GET',
              async : false,
              data: {
                draw: 1,
                start: 1,
                length: 100,
                className: data.value,
                sort: 'asc',
                sortColumn: 'username'
              },
              dataType: 'json'
            }).then(function (msg) {
              let array = new Array();
              for(let i=0;i<msg.recordsTotal;i++){
                array.push(msg.data[i].fraction_change.split(','));
              }
              for(let i=0;i<array[0].length;i++){
                let sum = 0;
                for(let j=0;j<array.length;j++){
                  if(array[j][i] == null) {
                    continue;
                  }
                  sum += parseInt(array[j][i]);

                }
                classArray.push((sum/msg.recordsTotal).toFixed(1));
              }
            }).fail(function () {
              console.log('失败');
            });
            setTimeout(function () {
              var myChart = echarts.init(document.getElementById('fraction_lineChart_avg'));

              // 指定图表的配置项和数据
              var option = {
                title: {
                  text: ''
                },
                tooltip: {
                  trigger: 'axis'
                },
                legend: {
                  data:['班级平均分']
                },
                grid: {
                  left: '3%',
                  right: '6%',
                  bottom: '3%',
                  containLabel: true
                },
                toolbox: {
                  feature: {
                    saveAsImage: {}
                  }
                },
                xAxis: {
                  type: 'category',
                  boundaryGap: false,
                  data: ['一','二','三','四','五','六','七','八','九','十'],
                  name: '近十天'
                },
                yAxis: {
                  type: 'value'
                },
                series: [
                  {
                    name:'班级平均分',
                    type:'line',
                    stack: '总量',
                    data: classArray.slice(-10)
                  }
                ]
              }
              // 使用刚指定的配置项和数据显示图表。
              myChart.setOption(option);
              setTimeout(function (){
                window.onresize = function () {
                  myChart.resize();
                }
              },200);
            }, 300)

          });
          form.render();
        });
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
          $("#nav .logo").removeClass("logoFalse");$("#nav .logo").addClass("logoTrue");
          $("#nav .nav-underline").css("color","#3F3F3F");
          $("#nav .layui-icon").css("color","#3F3F3F");
        } else {
          $("#nav").css("position","absolute");
          $("#nav").removeClass("navTrue");$("#nav").addClass("navFalse");
          $("#nav .logo").removeClass("logoTrue");$("#nav .logo").addClass("logoFalse");
          $("#nav .nav-underline").css("color","#FFF");
          $("#nav .layui-icon").css("color","#FFF");
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
      lineChart: function () {
        var myChart = echarts.init(document.getElementById('fraction_lineChart'));

        let fractionArray = this.fraction_change.split(",");
        // 指定图表的配置项和数据
        var option = {
          title: {
            text: ''
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data:['分数']
          },
          grid: {
            left: '3%',
            right: '6%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['一','二','三','四','五','六','七','八','九','十'],
            name: '近十天'
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name:'分数',
              type:'line',
              stack: '总量',
              data: fractionArray.slice(-10)
            }
          ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        setTimeout(function (){
          window.onresize = function () {
            myChart.resize();
          }
        },200)

      },
      lineChart_avg: function () {
        var myChart = echarts.init(document.getElementById('fraction_lineChart_avg'));

        let fractionArray = this.fraction_change.split(",");
        // 指定图表的配置项和数据
        var option = {
          title: {
            text: ''
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data:['班级平均分']
          },
          grid: {
            left: '3%',
            right: '6%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['一','二','三','四','五','六','七','八','九','十'],
            name: '近十天'
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name:'班级平均分',
              type:'line',
              stack: '总量',
              data: ''
            }
          ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        setTimeout(function (){
          window.onresize = function () {
            myChart.resize();
          }
        },200)

      },
      fractionLog: function (self, start, recordsTotal, searchKey) {
        $.ajax({
          url: 'http://localhost:8848/fractionLog/list',
          type: 'GET',
          async : false,
          data: {
            draw: 1,
            start: self.start,
            length: self.pagesize,
            searchKey: searchKey
          },
          dataType: 'json'
        }).then(function (msg) {
          self.logDatails = msg.data;
          self.count = msg.recordsTotal;
          self.filterCount = msg.recordsFiltered;
          recordsTotal = msg.recordsTotal;
          form.render()
        }).fail(function () {
          console.log('失败');
        });
        setTimeout(function () {
          self.layuiPage(recordsTotal, self.pagesize, self, searchKey);
        }, 500);
      },
      layuiPage(total, pageSize, self, searchKey){
        layui.use(['laypage', 'layer'], function(){
          let laypage = layui.laypage,
              layer = layui.layer;

          laypage.render({
            elem: 'Pagination',
            count: total,
            layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
            limit: pageSize,
            theme: '#1E9FFF',
            jump: function(obj, first) {
              if(!first) {
                $.ajax({
                  url: 'http://localhost:8848/fractionLog/list',
                  type: 'get',
                  data: {
                    draw: 1,
                    start: obj.curr,
                    length: obj.limit,
                    searchKey: searchKey,
                  },
                  dataType: 'json'
                }).then(function (msg) {
                  //把从json获取的数据赋值给数组
                  self.logDatails = msg.data;
                }).fail(function () {
                  console.log('失败');
                });
              }
            }
          });

        });
      },
      splitChangeFraction: function (fraction) {
        let changeScore = fraction.substring(fraction.indexOf("(")+1, fraction.indexOf(")"));
        if (changeScore > 0) {
          return "<div style='float: right;font-size: 10px;color: white;background-color: green;width: 20px;height: 20px;border-radius: 50%;text-align: center'>"+ "+"+changeScore +"</div>";
        }
        if (changeScore < 0) {
          return "<div style='float: right;font-size: 10px;color: white;background-color: red;width: 20px;height: 20px;border-radius: 50%;text-align: center'>"+ changeScore +"</div>";
        }
      },

      // 彻底删除分数日志
      delfractionLog: function (id) {
        let ids = id;
        let that = this;
        if(that.role_id == 2) {
          layer.confirm('确认要彻底删除吗？',function(index){
            $.ajax({
              url: 'http://localhost:8848/fractionLog/del',
              type: 'DELETE',
              data: {
                'ids': ids,
              },
              dataType: 'json',
              success: function (data) {
                if(data.success) {
                  layer.msg('已彻底删除!',{icon: 1,time:1000});
                  $("#"+id).parents("tr").remove();
                } else {
                  layer.msg(data.message + ' 删除失败',{icon: 2,time:1000});
                }

              },
              error: function (data) {
                layer.msg('删除失败',{icon: 2,time:1000});
              }
            });

          });
        }else {
          layer.msg('抱歉，您没有该权限！看就看，点它干什么...',{icon: 2,time:2000});
        }

      },
      // 批量删除分数日志
      delAllLog: function () {
        let ids = [];
        let that = this;
        if(that.role_id == 2) {
          // 获取选中的id
          $('tbody input[type="checkbox"]').each(function(index, el) {
            if($(this).prop('checked')){
              ids.push($(this).val())
            }
          });
          let str = "确认要删除所选的" + ids.length +"条数据吗？";
          layer.confirm(str ,function(index){
            $.ajax({
              url: 'http://localhost:8848/fractionLog/del',
              type: 'DELETE',
              data: {
                'ids': ""+ids
              },
              dataType: 'json',
              success: function (data) {
                if(data.success) {
                  // $(".layui-form-checked").not('.header').parents('tr').remove();
                  for(let i = 0; i < ids.length; i++) {
                    $("#"+ids[i]).parents("tr").remove();
                  }
                  layer.msg('移除成功!',{icon: 1,time:1000});
                } else {
                  layer.msg(data.message + ' 移除失败',{icon: 2,time:1000});
                }

              },
              error: function (data) {
                layer.msg('移除失败',{icon: 2,time:1000});
              }
            });
          });
        }else {
          layer.msg('抱歉，您没有该权限！看就看，点它干什么...',{icon: 2,time:2000});
        }
      }
    },
    filters: {
      formatDate(time) {
        // time = time * 100;
        let date = new Date(time);
        return date.getFullYear()+"/"+date.getMonth()+"/"+date.getDay()+" "+date.getHours()+":"+date.getMinutes();
      },
      splitFraction(fraction) {
        let score = fraction.substring(0, fraction.indexOf("("));
        return score;
      },
    }
  }
</script>

<style scoped>
  @import "../../assets/style/home.css";
</style>
