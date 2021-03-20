const express = require('express')
const app = express();
const cors = require('cors')

const session = require('express-session')
app.use(session({//session id,通过对传入的密钥进行加密生成
    secret: 'keyboard cat',//密钥
    name: 'sessionId',
    resave: false,
    saveUninitialized: true,
    cookie:{ secure: true }
}))

app.use(cors());

const cookieParser = require('cookie-parser')
app.use(cookieParser('keyboard cat'))

app.use(express.urlencoded({extended: true}))

app.use(express.json())

app.use('/api/blog', require('./api/blog'))
app.use('/api/comments', require('./api/comments'))
app.use('/api/everyday', require('./api/everyday'))
app.use('/api/mapping', require('./api/mapping'))
app.use('/api/tags', require('./api/tags'))
app.use('/api/about', require('./api/about'))
app.use('/api/notice', require('./api/notice'))
app.use('/api/code', require('./api/vcode'))
app.use('/api/blogger', require('./api/blogger'))

app.use(require('./errorMiddleware'))
const port = '7890'
app.listen(port,()=>{
    console.log(`server listen on ${port}`);
})