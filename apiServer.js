const express = require("express")
const app = express()
const mongoose = require("mongoose")
const apiDB = require('./models/apiModel')

mongoose.connect('mongodb://localhost/apiModel', {
    useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine' , 'ejs')
app.listen(process.env.PORT || 5003)
app.use(express.json)
app.get("/start", async (req, res) => {
    await apiDB.create({call: "x", rateLimit: 2})
    res.redirect("/api")
    
})

app.post("/rate", async (req, res) => {
    var apiInfo = await apiDB.findOne({call: "x"})
    apiInfo.rateLimit = req.body.rate
    apiInfo.save()
    console.log("this is rate limit: ----", apiInfo.rateLimit)
})

app.get("/api", async (req, res) => {
    var firstCallInWindow = -1
    var apiInfo = await apiDB.findOne({call: "x"})
    const callLogInfo = apiInfo.callLogs
    
    const noOfCallsMade = async (callLogInfo) => {
        const currentTime = new Date()
        let index = callLogInfo.length-1
        let count = 0
        while(index >= 0 && currentTime-callLogInfo[index] <= 60000 && count < apiInfo.rateLimit){
            console.log(currentTime-apiInfo.callLogs[index], "time difference")
            count += 1
            index -= 1

        }
        firstCallInWindow = index+1
        console.log("this is count-------", count)
        return count
        
    }
    const count = await noOfCallsMade(callLogInfo)
    const date = new Date()
    if(count >= apiInfo.rateLimit){
        apiInfo.failedReq.push(date)
        apiInfo.save()
        let index = callLogInfo.length-1
        let waitingTime = parseInt((60000-(date-callLogInfo[firstCallInWindow]))/1000)
        res.setHeader('X-WAIT-TILL', waitingTime)
        res.setHeader('X-RATE-LIMIT', apiInfo.rateLimit)
        return res.sendStatus(429)
    }
    if(apiInfo == null) return res.sendStatus(404)
    apiInfo.totalTimesCalled++
    apiInfo.lastTimeCalled = date
    apiInfo.callLogs.push(date)
    apiInfo.save()
    console.log(apiInfo, "this is api log info")
    res.json(apiInfo)
})