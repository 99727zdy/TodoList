const express = require('express')
let app = express()
const bodyparser = require('body-parser')
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: false }))

const mainController = require(process.cwd() + '/Controllers/main')

//设置跨域访问
app.all('*', function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
  res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.setHeader("X-Powered-By", ' 3.2.1')
  res.setHeader("Access-Control-Allow-Headers", "x-requested-with,Authorization,token, content-type");
  res.setHeader("Content-Type", "application/json;charset=utf-8");
  next();
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/doc' + '/index.html')
})

app.post('/api/v1/login', mainController.initUser)

app.post('/api/v1/add', mainController.addList)
app.delete('/api/v1/del', mainController.delList)
app.put('/api/v1/up', mainController.upList)
app.get('/api/v1/read', mainController.readList)

app.listen('3000', () => {
  console.log('http://localhost:3000');
})