const roleRouter = require("./RoleRoute")
const userRouter = require("./userRoute")
const publisherRoute = require("./publisherRoute")
const authorRoute = require("./authorRoute")
const genreRoute = require("./genreRoute")
const mangaRoute = require("./mangaRoute")
const chapterRoute = require("./chapterRoute")
const followingRoute = require("./followingRoute")
const commentRoute = require("./commentRoute")
const ratingRoute = require("./ratingRoute")
const notificationRoute = require("./notificationRoute")

const routes = (app) =>{
    app.use('/users',userRouter)
    app.use('/roles',roleRouter)
    app.use('/publishers',publisherRoute)
    app.use('/authors',authorRoute)
    app.use('/genres',genreRoute)
    app.use('/manga',mangaRoute)
    app.use('/chapters',chapterRoute)
    app.use('/followings',followingRoute)
    app.use('/ratings',ratingRoute)
    app.use('/comments',commentRoute)
    app.use('/notifications',notificationRoute)

}

module.exports = routes