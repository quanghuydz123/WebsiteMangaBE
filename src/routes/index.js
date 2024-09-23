const roleRouter = require("./RoleRoute")
const userRouter = require("./userRoute")

const routes = (app) =>{
    app.use('/users',userRouter)
    app.use('/roles',roleRouter)

}

module.exports = routes