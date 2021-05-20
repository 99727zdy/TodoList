axios.defaults.baseURL = 'http://localhost:3000/api/v1';
new Vue({
  el: '#app',
  data() {
    return {
      dialogTableVisible: false,
      dialogFormVisible: true,
      // 登录表单
      loginForm: {
        user: '8963',
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
        [{ tag: '生活' }, { tag: '学习' }, { tag: '工作' }],
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
        createUser: this.loginForm.user
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
      console.log(ListItem);
    }
  }
})