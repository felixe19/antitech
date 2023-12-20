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
        //     let newData = Object.assign({}, appData, {availableBooks:result});
        //     console.log(newData)
        //     res.render("list.ejs", newData)
        //  });
    });
    // register page
    app.get('/register', function (req,res) {
        res.render('register.ejs', appData);                                                                     
    });
    // post-registering..                                                                                             
    app.post('/registered', function (req,res) {
        bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
            // store hashed pwd in database
        })
        // saving data in database
        // res.send(' Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email);
        result = 'Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email;
        result += 'Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword;
        res.send(result);
    }); 
    // sign-in page
    app.get('/sign-in', function(req, res) {
        res.render('sign-in.ejs', appData)
    });
    
}
