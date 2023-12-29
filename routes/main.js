module.exports = function (app, appData) {
    // bcrypt to avoid missing or undefined err
    const bcrypt = require('bcrypt');
    // redirection after authentication
    const redirectLogin = (req, res, next) => {
        if (!req.session.userId && (req.originalUrl !== './sign-in' || req.originalUrl !== './signed-in')) {
            // this will save url before signin to send user back to this page, now signed
            req.session.returnTo = req.originalUrl;
            res.redirect('./sign-in')
        } else { next (); }
    }
    // valudation
    const { check, validationResult } = require('express-validator');

    // handle routes
    // ==============
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
    // blog
    app.get('/blog', function (req, res) {
        console.log("Currently on: BLOG page....");
        let sqlquery = `
            SELECT blog.title, blog.content, user.username AS author, community.comName AS community, blog.datePosted
            FROM blog
            INNER JOIN user ON blog.author = user.userID
            INNER JOIN community ON blog.communityID = community.communityID
            ORDER BY blog.datePosted DESC
        `;
        db.query(sqlquery, (err, results) => {
            if (err){
                throw err;
                res.redirect('./');
            }
            let newData = Object.assign({}, appData, {blogs:results});
            res.render('blog.ejs', newData);
        });
    });
    // community page
    app.get('/community', function(req, res) {
        console.log("Currently on: COMMUNITY page....")
        db.query('SELECT * FROM community', (err, results) => {
            if (err) {
                throw err;
                res.redirect('./')
            }
            let newData = Object.assign({}, appData, {community:results});    
            res.render('community.ejs', newData);
        });
    });
    // library page
    app.get('/library', function(req, res) {
        console.log("Currently on: LIBRARY page....")
        let sqlquery = 'SELECT * FROM book';
        db.query(sqlquery, (err, results) => {
            if (err) {
                console.error('Internal error:', err);
                return res.status(500).send('Internal error occurred.');
            }
            console.log('Query results:', results);
            let newData = Object.assign({}, appData, {book:results});  
            res.render('library.ejs', newData);
        });
    });
    // TODO: include search and/or filter results page...
    app.get('/list', redirectLogin, function(req, res) {
        console.log("Currently on: LIST page....")
        let sqlquery = `
            SELECT u.userID, u.username, c.communityID, c.comName
            FROM user u
            LEFT JOIN blog b ON u.userID = b.author
            LEFT JOIN community c ON b.communityID = c.communityID
        `;
        db.query(sqlquery, (err, results) => {
            if (err)
            {
                throw err;
                res.redirect('./');
            };
            let newData = Object.assign({}, appData, {users:results});  
            res.render('list.ejs', newData);
        });
    });
    // register page
    app.get('/register', function (req,res) {
        console.log("Currently on: REGISTER page....")
        if (req.session.userId) {
            const userEmail = req.session.userId;
            const alertMessage = `You are already registered and signed in as ${userEmail}!`;
            // res.redirect('/');
            // this url query will display an alert letting the user know they're logged in as ___ like the above line
            res.redirect(`/?alertMessage=${encodeURIComponent(alertMessage)}`);
        } else {
            res.render('register.ejs', appData);                                           
        }         
    });
    // post-registering..                                                                                            
    app.post('/registered', [
        check('email').isEmail().withMessage('Email must be valid.'),
        check('pwd').isLength({min: 8}).withMessage('Password must be at least 8 characters long!').matches(/\d/).withMessage('Password must contain atleast one digit...'),
        check('username').notEmpty().withMessage('Username cannot be empty.')
        ], function (req, res) {
        // --- begin post ---
        console.log("Currently on: REGISTER DISPLAY page....")
        const saltRounds = 10;
        const plainPassword = req.body.pwd;
        const errors = validationResult(req);
        req.sanitize(req.body.username);
        req.sanitize(req.body.email);
        req.sanitize(req.body.bio);
        if (!errors.isEmpty()) {
            res.redirect('./register');
        } else {        
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
                    pwd: hashedPassword,
                    bio: req.body.bio
                };
                // insert user
                db.query('INSERT INTO user SET ?', new_user, (ins_err, ins_res) => {
                    if (ins_err) {
                        console.log('Error inserting user to database: ', ins_err);
                        return res.status(500).send('Error registering the user');
                    }
                    // log the hashed passwords
                    const result = 'Hello ' + req.body.username + ' you are now registered! + <a href='+'./'+'>Home</a>';
                    // send response
                    res.send(result);
                }); // end db
            });
        }
    });
    // sign-in page
    app.get('/sign-in', function(req, res) {
        console.log("Currently on: SIGN-IN page....")
        if (req.session.userId) {
            const userEmail = req.session.userId;
            const alertMessage = `You are already signed in as ${userEmail}!`;
            // res.redirect('/');
            // this url query will display an alert letting the user know they're logged in as ___ like the above line
            res.redirect(`/?alertMessage=${encodeURIComponent(alertMessage)}`);
        } else {
            res.render('sign-in.ejs', appData);            
        }         
    });
    // signed in page
    app.post('/signed-in', [
        check('email').isEmail().withMessage('Email must be valid.'),
        check('pwd').notEmpty().withMessage('Username cannot be empty.')
    ], function (req, res) {
        console.log("Currently doing SIGN-IN OPERATIONS (/signed-in)....");
        let sqlquery = 'SELECT pwd FROM user WHERE email = ?';
        req.sanitize(req.body.email);
        const errors = validationResult(req); // forgot to define here
        if (!errors.isEmpty()) {
            res.redirect('./register');
        } else {
            db.query(sqlquery, [req.body.email], (err, result) => {
                if (err) {
                    // handle error if hashing fails
                    console.error('Internal error:', err);
                    return res.status(500).send('Internal error occurred.');
                }
                // result > 0  means that a matching password found for that email
                if (result.length > 0) {
                    // assign the hashed password to address error...
                    const hashedPassword = result[0].pwd;
                    // move bcrypt function here
                    bcrypt.compare(req.body.pwd, hashedPassword, function (comp_err, comp_res) {
                        if (comp_err) {
                            // error: comparing passwords > db side
                            console.error('Error comparing passwords:', compareErr);
                            return res.status(500).send('Error comparing passwords');
                        } else if (comp_res) {
                            // passwords match: user auth OK !
                            req.session.userId = req.body.email;
                            // redirection logic for already authenticated users
                            if (req.session.returnTo) {
                                const redirectTo = req.session.returnTo;
                                delete req.session.returnTo;
                                return res.redirect(redirectTo);
                            } else {
                                return res.redirect('./'); // Redirect to home if no returnTo path
                            }
                        } else {
                            // passwords do not match: user auth FAIL -> 401 auth error
                            res.status(401).send('Incorrect password');
                        }
                    });
                } else {
                    // user not found: 404 error
                    res.status(404).send('User not found for that email!');
                }
            });
        }
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
    // add post page
    app.get('/add-post', redirectLogin, function(req, res) {
        console.log("Currently on: ADD POST page....");
        db.query('SELECT * FROM community', (err, results) => {
            if (err) {
                throw err;
                res.redirect('./')
            }
            // FIXED: PASS USERID TO STOP ERR THROWING
            let newData = Object.assign({}, appData, {community:results, userId: req.session.userId});
            console.log(newData);
            res.render('add-post.ejs', newData);
        });
    });

    app.post('/added', [
            check('title').notEmpty().withMessage('Title cannot be empty'),
            check('content').notEmpty().withMessage('Content field cannot be empty'),
        ], function (req, res) {
        // --- begin post ---
        console.log('Currently performing ADD POST operations...');

        const errors = validationResult(req);
        req.sanitize(req.body.title);
        req.sanitize(req.body.content);
        req.sanitize(req.body.community);
        req.sanitize(req.body.newCommunity);

        if (!errors.isEmpty()) {
            res.redirect('./');
        } else {
            // NOTE: BLOG FOREIGN KEY USERID IS INT, NOT EMAIL > RETRIEVE ID
            const email = req.session.userId;

            let sqlID = 'select userID FROM user WHERE email = ?';
            db.query(sqlID, [email], (err, result) => {
                if (err) {
                    console.error('Error retrieving user ID:', err);
                    res.redirect('./');

                } else {
                    const userID = result[0].userID; // get the userID
    
                    // create the post with the retrieved ID
                    if (req.body.community) {
                        const new_post = {
                            title: req.body.title,
                            content: req.body.content,
                            author: userID,
                            communityID: req.body.community,
                            datePosted: new Date()
                        };
    
                        // insert new post
                        db.query('INSERT INTO blog SET ?', new_post, (ins_err, ins_res) => {
                            if (ins_err) {
                                console.log('Error inserting blog to database: ', ins_err);
                                return res.status(500).send('Error addding new blog post...');
                            }
                            // log the success
                            const result = 'Hello ' + req.body.username + ' your post was added successfully! '+'<a href='+'./'+'>Home</a>';
                            // send response
                            res.send(result);
                        }); // end db
                    } // === END EXISTING COMMUNITY ===
    
                    // new community instance
                    if (req.body.newCommunity) {
                        const new_comm = {
                            comName: req.body.newCommunity
                        };
            
                        // Insert new community into the database
                        const sqlInsertNewCommunity = 'INSERT INTO community (comName) VALUES (?)';
                        db.query(sqlInsertNewCommunity, [req.body.newCommunity], (err, result) => {
                            if (err) {
                                console.error('Error inserting new community:', err);
                                // Handle the error appropriately
                            } else {
                                const new_post = {
                                    title: req.body.title,
                                    content: req.body.content,
                                    author: userID,
                                    communityID: result.insertId, // auto-generated ID of the new community
                                    datePosted: new Date()
                                };
                                // insert new post
                                db.query('INSERT INTO blog SET ?', new_post, (ins_err, ins_res) => {
                                    if (ins_err) {
                                        console.log('Error inserting blog to database: ', ins_err);
                                        return res.status(500).send('Error addding new blog post...');
                                    }
                                    // log the success
                                    const result = 'Hello ' + req.session.userID + ' your post was added successfully! Click to view: '+'<a href='+'./'+'>blog</a>';
                                    // send response
                                    res.send(result);
                                }); // end db
                            }
                        });
                    } // === END NEW COMMUNITY ===
                }
            }); // END USERID SQL
        } // end else statement
    
    }); // END POST ADDED
    
} // end module exports::  == FINAL END ==
