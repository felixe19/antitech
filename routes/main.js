module.exports = function (app, appData) {
    // handle routes

    // home page : index page
    app.get('/', function (req, res) {
        console.log("Currently on: Index page....")
        res.render('index.ejs', appData)
    });
    //about page
    app.get('/about', function(req, res) {
        console.log("Currently on: ABOUT page....")
        res.render('about.ejs', appData)
    });
    // community page
    app.get('/community', function(req, res) {
        console.log("Currently on: COMMUNITY page....")
        db.query('SELECT username FROM user', (err, results) => {
            if (err) throw err;
            let newData = Object.assign({}, appData, {users:results});    
            res.render('community.ejs', newData);
        });
    });
    // library page
    app.get('/library', function(req, res) {
        console.log("Currently on: LIBRARY page....")
        res.render('library.ejs', appData)
    });
    // TODO: include search and/or filter results page...
    app.get('/list', function(req, res) {
        console.log("Currently on: LIST page....")
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
        console.log("Currently on: REGISTER page....")
        res.render('register.ejs', appData);                                                
    });
    // post-registering..                                                                                             
    app.post('/registered', function (req, res) {
        console.log("Currently on: REGISTER DISPLAY page....")
        const bcrypt = require('bcrypt');
        const saltRounds = 10;
        const plainPassword = req.body.pwd;
        
        bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
            // WORKING CODE
            if (err) {
                // handle error if hashing fails
                console.error('Error hashing the password:', err);
                return res.status(500).send('Error hashing the password');
            }
            // log the hashed passwords
            const result = 'Hello ' + req.body.username + ' you are now registered! We will send an email to you at ' + req.body.email;
            // console.log("hey " + result + ' Your hashed password is: ' + hashedPassword);
            
            // send response
            res.send(result);
        });
    });
    
    // sign-in page
    app.get('/sign-in', function(req, res) {
        console.log("Currently on: SIGN-IN page....")

        // TODO: compare the sql query
        // SQL QUERY SHOULD BE SOMETHING LIKE... select pwd from user where username/email = ?
        // this will pick the hashed password to compare
        let sqlquery = 'SELECT pwd FROM user WHERE email = ?';
        db.query(sqlquery, (err, result) => {
            // move bcrypt function here
            

            // move render here
        });

        bcrypt.compare(req.body.pwd, hashedPassword, function(err, result) {
            if (err) {
                // error: comparing passwords > db side
            } else if (result) {
                // passwords match: user auth OK !
            } else {
                // passwords do not match: user auth FAIL
            }
        });

        res.render('sign-in.ejs', appData)
    });
    
}
