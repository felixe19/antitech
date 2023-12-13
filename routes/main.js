module.exports = function (app, appData) {
    // handle routes

    // home page : index page
    app.get('/', function (req, res) {
        console.log("Currently on: Index page....")
        res.render('index.ejs', appData)
    });
    //about page
    app.get('/about', function(req, res) {
        res.render('about.ejs', appData)
    });
    // community page
    app.get('/community', function(req, res) {
        res.render('community.ejs', appData)
    });
    // library page
    app.get('/library', function(req, res) {
        res.render('library.ejs', appData)
    });
    // TODO: include search and/or filter results page...
    app.get('/list', function(req, res) {
        // code below from bertbooks >> correct it
        // ==================== 
        // let sqlquery = "SELECT * FROM books"; // query database to get all the books
        // // execute sql query
        // db.query(sqlquery, (err, result) => {
        //     if (err) {
        //         res.redirect('./'); 
        //     }
        //     let newData = Object.assign({}, shopData, {availableBooks:result});
        //     console.log(newData)
        //     res.render("list.ejs", newData)
        //  });
    });
    // register page
    app.get('/register', function (req,res) {
        res.render('register.ejs', shopData);                                                                     
    });
    // post-registering..                                                                                             
    app.post('/registered', function (req,res) {
        // saving data in database
        res.send(' Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email);                                                                              
    }); 
    // sign-in page
    app.get('/sign-in', function(req, res) {
        res.render('sign-in.ejs', appData)
    });
    
}
