module.exports = function (app, appData) {
    const bcrypt = require('bcrypt');
    // redirection after authentication
    const redirectLogin = (req, res, next) => {
        if (!req.session.userId ) {
            res.redirect('./sign-in')
        } else { next (); }
    }

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
    app.get('/list', redirectLogin, function(req, res) {
        console.log("Currently on: LIST page....")
        db.query('SELECT username FROM user', (err, results) => {
            if (err)
            {
                throw err;
                res.redirect('./');
            };
            let newData = Object.assign({}, appData, {users:results});    
            res.render('community.ejs', newData);
        });
    });
    // register page
    app.get('/register', function (req,res) {
        console.log("Currently on: REGISTER page....")
        res.render('register.ejs', appData);                                            
    });
    // post-registering..                                                                                            
    app.post('/registered', function (req, res) {
        console.log("Currently on: REGISTER DISPLAY page....")
        // const bcrypt = require('bcrypt');
        const saltRounds = 10;
        const plainPassword = req.body.pwd;
        
        bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
            // WORKING CODE
            if (err) {
                // handle error if hashing fails
                console.error('Error hashing the password:', err);
                return res.status(500).send('Error hashing the password');
            }
            // no err: create the user to send to database
            const new_user = {
                username: req.body.username,
                email: req.body.email,
                pwd: hashedPassword
            };
            // insert user
            db.query('INSERT INTO user SET ?', new_user, (ins_err, ins_res) => {
                if (ins_err) {
                    console.log('Error inserting user to database: ', ins_err);
                    return res.status(500).send('Error registering the user');
                }
                // log the hashed passwords
                const result = 'Hello ' + req.body.username + ' you are now registered!';
                // send response
                res.send(result);
            }); // end db
        });
    });
    // sign-in page
    app.get('/sign-in', function(req, res) {
        console.log("Currently on: SIGN-IN page....")
        res.render('sign-in.ejs', appData);            
    });
    // signed in page
    app.post('/signed-in', function(req, res) {
        console.log("Currently doing SIGN-IN OPERATIONS (/signed-in)....");
        let sqlquery = 'SELECT pwd FROM user WHERE email = ?';
        db.query(sqlquery, [req.body.email], (err, result) => {
            if (err) {
                // handle error if hashing fails
                console.error('Internal error:', err);
                return res.status(500).send('Internal error occurred.');
            }
            // result > 0  means that a matchinh password found for that email
            if (result.length > 0) {
            // assign the hashed password to address error...
            const hashedPassword = result[0].pwd;
            // move bcrypt function here
                bcrypt.compare(req.body.pwd, hashedPassword, function(comp_err, comp_res) {
                    if (comp_err) {
                        // error: comparing passwords > db side
                        console.error('Error comparing passwords:', compareErr);
                        return res.status(500).send('Error comparing passwords');
                    } else if (comp_res) {
                        // passwords match: user auth OK !
                        req.session.userId = req.body.email;
                        res.redirect('./');
                        // res.send({message:'Authentication successful!', result: result});
                    } else {
                        // passwords do not match: user auth FAIL -> 401 auth error
                        res.staus(401).send('Incorrect password');
                    }
                });
            } else {
                // user not found: 404 error
                res.status(404).send('User not found for that email!');
            }
        });
    });
    // signout page
    app.get('/sign-out', redirectLogin, (req,res) => {
        req.session.destroy(err => {
            if (err) {
                return res.redirect('./')
            }
            res.send('you are now logged out. <a href='+'./'+'>Home</a>');
        })
    });
    
}
