axios.defaults.baseURL = 'http://localhost:3000/api/v1';
new Vue({
  el: '#app',
  data() {
    return {
      dialogTableVisible: false,
      dialogFormVisible: true,
      statusL:false,
      // 登录表单
      loginForm: {
        user: 'zy3280',
        pwd: '123456'
      },
      // 登录验证
      loginRules: {
        // required 是否为空
        // trigger  验证触发的方式
        user: [
          { required: true, trigger: 'blur', min: 4, message: "用户名不能小于4位" }
        ],
        pwd: [
          { required: true, trigger: 'blur', min: 6, max: 10, message: "用户名不能小于6位" }
        ]
      },
      // 标签
      tagList:
        [{ tag: '传感器1' }, { tag: '传感器2' }, { tag: '传感器3' }],
      // 添加
      formInline: {
        tag: '',
        content: '',
        planTime: ''
      },
      // 用户list
      userForm: [],
      listRules: {
        tag: [
          { required: true, trigger: 'blur', message: "不能为空" }
        ],
        content: [
          { required: true, trigger: 'blur', message: "不能为空" }
        ],
        planTime: [
          { required: true, trigger: 'blur', message: "不能为空" }
        ]
      }
    }
  },
  methods: {
    getList() {
      axios.get('/read', {
        params: {
          status:this.statusL,
          createUser:this.loginForm.user
        }
      }).then((response) => {
        this.userForm = response.data.data
      })
    },
    login(loginForm) {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          axios.post('/login', {
            user: loginForm.user,
            pwd: loginForm.pwd
          }).then((response) => {
            if (response.data.meta.status == 200) {
              this.$message({
                message: response.data.meta.msg,
                type: 'success'
              });
              this.dialogFormVisible = false
              document.getElementById('main').style.display = "block"
              this.statusL='false'
              this.getList()
            } else {
              this.$message({
                message: response.data.meta.msg,
                type: 'warning'
              });
            }
          })
        } else {
          return false;
        }
      });
    },
    onAdd(postData) {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          postData.createUser = this.loginForm.user;
          // console.log(postData);
          // axios.请求方法('请求地址'，参数)
          axios.post('/add', postData)
            .then((response) => {
              // console.log(response.data);
              if (response.data.meta.status == 200) {
                this.$message({
                  message: response.data.meta.msg,
                  type: 'success'
                });
                this.formInline = {}
                this.getList()
              } else {
                this.$message({
                  message: response.data.meta.msg,
                  type: 'warning'
                });
              }
            })
        } else {
          return false;
        }
      });
    },
    finish(ListItem) {
      axios.put('/up', {
        _id:ListItem._id,
        status:'true'
      })
      .then((response) => {
        if (response.status === 200) {
          this.$message({
            message:'已完成',
            type:'success'
          });
          this.getList()
        }
      })
  },
    handleClick(tab, event) {
      if(tab.name=='unfinished'){
        this.statusL='false'
      }
      if(tab.name=='finish'){
        this.statusL='true'
      }
      this.getList()
    },
    delList(listItem){
      axios.delete('/del',{
        params: {
          _id:listItem._id
        }
      }).then((response) =>{
        if (response.status === 200){
          this.$message({
            message:'已删除',
            type:'warning'
          });
          this.getList()
        }
      })
    },
    upData(listItem){
      axios.put('/up',{
        _id:listItem._id,
        tag:listItem.tag,
        content:listItem.content,
        planTime:listItem.planTime
      }).then((response) =>{
        if(response.status == 200){
          this.$message({
            message:'已更新',
            type:'success'
          })
        }
      })
    },
    echarts(){
      var myChart = echarts.init(document.getElementById('week'));
        // 指定图表的配置项和数据
        var option = {
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
                data:['销量']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }
  },
  mounted() {
    this.echarts();
  },
})