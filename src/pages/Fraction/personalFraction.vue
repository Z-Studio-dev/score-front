<template>
  <div id="app">
    <div class="fraction_box">
      <p style="display: none">{{username}}</p>
      <div id="fraction_lineChart" style="width: 100%;height: 370px;"></div>
    </div>
  </div>
</template>
<script>
  import $ from 'jquery'
  export default {
    name: 'app',
    data() {
      return {
        classname: '',
        username: '',
        nickname: '',
        role_id: 0,
        token: '',
        scr: 0,
        fraction: 0,
        fraction_change: '',
        classFraction_avg: []
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
              self.fraction_change = data.result.fraction_change;
            },
            error: function (data) {
              console.log('失败');
            }
          });
        },300);
        setTimeout(function () {
          self.lineChart();
        }, 800)
      }
      if(this.role_id == 2){  //教师
        setTimeout(function () {
          self.lineChart2();
        }, 800);
      }
      setTimeout(function () {
        self.getAllStudent();
      }, 500)
    },
    methods: {
      getAllStudent: function () {
        let self = this;
        $.ajax({
          url: 'http://localhost:8848/student/list/classname',
          type: 'GET',
          async : false,
          data: {
            draw: 1,
            start: 1,
            length: 100,
            className: self.$route.query.classname,
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
            self.classFraction_avg.push((sum/msg.recordsTotal).toFixed(1));
          }
        }).fail(function () {
          console.log('失败');
        });
      },
      lineChart: function () {
        var myChart = echarts.init(document.getElementById('fraction_lineChart'));
        let _this = this;
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
            data:['分数','班级平均分']
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
              data: fractionArray.slice(-10)
            },
            {
              name:'班级平均分',
              type:'line',
              data: _this.classFraction_avg.slice(-10)
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
      lineChart2: function () {
        var myChart = echarts.init(document.getElementById('fraction_lineChart'));
        let _this = this;
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
              data: _this.classFraction_avg.slice(-10)
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
      }
    }
  }
</script>
<style scoped>
  .fraction_box{
    width: 90%;
    max-width: 1000px;
    height: 400px;
    margin: 0 auto;
    margin-top: 50px;
  }
</style>
