# creating the database from scratch
DROP DATABASE IF EXISTS antitech;
CREATE DATABASE IF NOT EXISTS antitech;

# select the database
USE antitech;

# create the user that the web app will use to access the database
# drop/erase the db if it already exists
DROP USER IF EXISTS 'anti'@'localhost';
CREATE USER 'anti'@'localhost' IDENTIFIED WITH mysql_native_password BY '33694197efeli001';
GRANT ALL PRIVILEGES ON antitech.* TO 'anti'@'localhost';      

# remove the tables if they already exist
# all existing data will be replaced with empty or defaulted/test input
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS book;
DROP TABLE IF EXISTS post;
DROP TABLE IF EXISTS community;

# create the tables
---------------------

# user table
CREATE TABLE user (
    userID INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    pwd VARCHAR(100) NOT NULL,
    -- profile picture ? maybe
    bio TEXT
);

# book / library table
CREATE TABLE book (
    bookID INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    author VARCHAR(100) NOT NULL,
    descript TEXT,
    genre VARCHAR(50),
    isAvailable BOOLEAN
);

# comminity table
CREATE TABLE community (
    communityID INT PRIMARY KEY AUTO_INCREMENT,
    comName VARCHAR(255) NOT NULL,
    descript TEXT
);

# blog table
CREATE TABLE blog (
    postID INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author INT, -- userID
    communityID INT,
    datePosted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author) REFERENCES user(userID),
    FOREIGN KEY (communityID) REFERENCES community(communityID)
);

# many to many : users in communities
CREATE TABLE communityMembership (
    userID INT,
    communityID INT,
    membershipDate DATE,
    FOREIGN KEY (userID) REFERENCES user(userID),
    FOREIGN KEY (communityID) REFERENCES community(communityID)
);

# basic values - TODO : ADD INFO > use full table -- DONE!
INSERT INTO book (title, author, descript, genre, isAvailable)
VALUES
    ('Abolish Silicon Valley: How to Liberate Technology from Capitalism', 'Wendy Liu',
        'Former insider turned critic Wendy Liu busts the myths of the tech industry, and offers a galvanising argument for why and how we must reclaim technologys potential for the public good.',
        'bildungsroman biography', TRUE),
    ('Algorithms of Oppression: How Search Engines Reinforce Racism', 'Safiya Umoja Noble',
        'A revealing look at how negative biases against women of color are embedded in search engine results and algorithms.',
        'race, gender, non-fiction', FALSE),
    ('Do Androids Dream of Electric Cars?: Public Transit in the Age of Google, Uber, and Elon Musk', 'James Wilt',
        'Public transportation is in crisis. Through an assessment of the history of automobility in North America, the "three revolutions" in automotive transportation, as well as the current work of committed people advocating for a different way forward, James Wilt imagines what public transit should look like in order to be green and equitable',
        'non-fiction, technology, urbanism, cities', TRUE),
    ('Too Smart: How Digital Capitalism is Extracting Data, Controlling Our Lives, and Taking Over the World', 'Jathan Sadowski',
        'Who benefits from smart technology? Whose interests are served when we trade our personal data for convenience and connectivity?',
        'non-fiction', FALSE),
    ('Bit Tyrants: The Political Economy of Silicon Valley', 'Rob Larson',
        'In this highly unauthorized account of the Big 5s origins, Rob Larson sets the record straight, and in the process shreds every focus-grouped bromide about corporate benevolence he could get his hands on.',
        'non-fiction, business, technology, politics, economics', TRUE),
    ('Capitalism, Technology, Labor: Socialist Register Reader Vol 2 (Socialist Register Reader, 2)', 'Greg Albo',
        'As we enter what some term the "fourth industrial revolution" and both mainstream commentators and the left grapple with the implications of rapid technological development, this volume is a timely and crucial resource for those looking to build a political strategy attentive to sweeping changes in how we produce goods and live our lives.',
        'non-fiction', TRUE),
    ('Race After Technology: Abolitionist Tools for the New Jim Code', 'Ruha Banjamin',
        'From everyday apps to complex algorithms, Ruha Benjamin cuts through tech-industry hype to understand how emerging technologies can reinforce White supremacy and deepen social inequity.',
        'nonfiction, race, social justice, sociology, politics', TRUE),
    ('Weapons of Math Destruction: How Big Data Increases Inequality and Threatens Democracy', 'Cathy O''Neil',
        'We live in the age of the algorithm. Increasingly, the decisions that affect our lives--where we go to school, whether we can get a job or a loan, how much we pay for health insurance--are being made not by humans, but by machines. Data scientist Cathy ONeil reveals the mathematical models being used today are unregulated and uncontestable, even when theyre wrong.',
        'non-fiction, science, technology, mathematics, politics', TRUE),
    ('Automating Inequality: How High-Tech Tools Profile, Police, and Punish the Poor', 'Virginia Eubanks',
        'In Automating Inequality, Virginia Eubanks systematically investigates the impacts of data mining, policy algorithms, and predictive risk models on poor and working-class people in America.',
        'non-fiction, technology, politics, social justics, sociology', FALSE);

# basic values >> pwds with the $2b$10$ bycrypt prefix ...
INSERT INTO user (username, email, pwd, bio) VALUES
    ('frank001', 'frank@example.com', '$2b$10$yBs5h5Ql48kLlIR9pY/XfuF3iv3Zp6EsF.HNmyfFw/8AhBntoUu0C', 'hi my name is frank'),
    ('edith436', 'edith@example.com', '$2b$10$FOAsAp0hqoD1tEGT2vS8oOJ7TZrD7Sx0zZ5Qt5NlgFv8E3VDlPlDG', 'hi my name is edith'),
    ('_ma_maria98', 'maria@example.com', '$2b$10$Cw/Mha7p5Kx1gt8nNPYp.e1Z.kMg/aHm0Xt4/HFrsLwJkzy3jn2mG', 'holi soy maria~'),
    ('noor_31', 'noor@example.com', '$2b$10$4y4D7no5Pnp33hhbVDEbDexmvOxP.B.DZLFaMQD4cvnUpJ/VD9P/2', 'im noor :)'),
    ('sakur4_', 'sakura@example.com', '$2b$10$LKRP57T9U0GRzbpCz8p5VucOqRmE6ng6CTn/gvGjK9DK5f8QQzF16', 'hi im sakura.x');

# TODO : finish tables >> blog & community
