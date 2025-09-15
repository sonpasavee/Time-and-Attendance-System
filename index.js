const express = require('express')
const app = express()
const ejs = require('ejs')
const mongoose = require('mongoose')
const expressSession = require('express-session')
const flash = require('connect-flash')


// MongoDB Connnection
mongoose.connect('mongodb+srv://admin:1234@cluster0.adhvho8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0' , {
    useNewUrlParser: true
})


// Controllers import
const indexController = require('./controllers/indexController')
const loginController = require('./controllers/loginController')
const registerController = require('./controllers/registerController')
const storeController = require('./controllers/storeUserController')
const loginUserController = require('./controllers/loginUserController')
const adminDashboardController = require('./controllers/adminDashboardController')
const employeeDashboardController = require('./controllers/employeeDashboardController')
const logoutController = require('./controllers/logoutController')
// Middleware Import
const {isAuthenticated , isAdmin , isEmployee} = require('./middleware/authMiddleware')

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded()) //encode form to object
app.use(flash())
app.use(expressSession({
    secret: "node secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 } // เก็บข้อมูล login 1 ชั่วโมง
}))
// middleware สำหรับส่ง loggedIn ไปทุก view
app.use((req, res, next) => {
    res.locals.messages = req.flash()
    res.locals.loggedIn = req.session.userId || null
    next()
})

app.set('view engine' , 'ejs')

// get controlelr
app.get('/' , indexController)
app.get('/login' , loginController)
app.get('/register' , registerController)
app.get('/admin/dashboard' , isAuthenticated , isAdmin , adminDashboardController)
app.get('/employee/dashboard' , isAuthenticated , isEmployee , employeeDashboardController)
app.post('/user/register' , storeController)
app.post('/user/login' , loginUserController)
app.get('/logout' , logoutController)

app.listen(4000 , () => {
    console.log("App listening on port 4000")
})
