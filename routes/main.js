module.exports = function (app, appData) {
    // handle routes

    // home page
    app.get('/', function (req, res) {
        console.log("Currently on: Index page....")
        res.render('index.ejs', appData)
    });
    //about page
    app.get('/about', function(req, res) {
        res.render('about.ejs', appData)
    });
}
