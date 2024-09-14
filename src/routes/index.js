const userRouter = require("./userRoute")

const routes = (app) =>{
    app.use('/users',userRouter)
}

module.exports = routes