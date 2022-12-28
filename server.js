const express = require("express")
const app = express()
const mongoose = require("mongoose")


const shortUrl = require('./models/shortUrl')

mongoose.connect('mongodb://localhost/urlShortner', {
    useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine' , 'ejs')
app.use(express.urlencoded({extended: false}))
app.listen(process.env.PORT || 5001)

app.get("/", async (req, res) => {
    const urls = await shortUrl.find()
    res.render("index", {shortUrls: urls})
})

app.get("/:shortId", async (req, res) => {
    const urlInfo = await shortUrl.findOne({short: req.params.shortId})
    if(urlInfo == null) return res.sendStatus(404)
    urlInfo.count = urlInfo.count + 1

    urlInfo.save()
    res.redirect(urlInfo.full)
})

app.post("/shortUrls", async (req, res) => {
    await shortUrl.create({full: req.body.fullUrl})
    res.redirect("/")
})