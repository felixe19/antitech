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


# basic values - TODO : ADD INFO > use full table
INSERT INTO book (title, author)
VALUES
    ('Abolish Silicon Valley: How to Liberate Technology from Capitalism', 'Wendy Liu'),
    ('Algorithms of Oppression: How Search Engines Reinforce Racism', 'Safiya Umoja Noble'),
    ('Do Androids Dream of Electric Cars?: Public Transit in the Age of Google, Uber, and Elon Musk', 'James Wilt'),
    ('Too Smart: How Digital Capitalism is Extracting Data, Controlling Our Lives, and Taking Over the World', 'Jathan Sadowski'),
    ('Bit Tyrants: The Political Economy of Silicon Valley', 'Rob Larson'),
    ('Capitalism, Technology, Labor: Socialist Register Reader Vol 2 (Socialist Register Reader, 2)', 'Greg Albo'),
    ('Race After Technology: Abolitionist Tools for the New Jim Code', 'Ruha Banjamin'),
    ('Weapons of Math Destruction: How Big Data Increases Inequality and Threatens Democracy', 'Cathy O''Neil'),
    ('Automating Inequality: How High-Tech Tools Profile, Police, and Punish the Poor', 'Virginia Eubanks');

# basic values >> pwds with the $2a$10$ bycrypt prefix ...
INSERT INTO user (username, email, pwd, bio) VALUES
    ('frank001', 'frank@example.com', '$2a$10$yBs5h5Ql48kLlIR9pY/XfuF3iv3Zp6EsF.HNmyfFw/8AhBntoUu0C', 'hi my name is frank'),
    ('edith436', 'edith@example.com', '$2a$10$FOAsAp0hqoD1tEGT2vS8oOJ7TZrD7Sx0zZ5Qt5NlgFv8E3VDlPlDG', 'hi my name is edith'),
    ('_ma_maria98', 'maria@example.com', '$2a$10$Cw/Mha7p5Kx1gt8nNPYp.e1Z.kMg/aHm0Xt4/HFrsLwJkzy3jn2mG', 'holi soy maria~'),
    ('noor_31', 'noor@example.com', '$2a$10$4y4D7no5Pnp33hhbVDEbDexmvOxP.B.DZLFaMQD4cvnUpJ/VD9P/2', 'im noor :)'),
    ('sakur4_', 'sakura@example.com', '$2a$10$LKRP57T9U0GRzbpCz8p5VucOqRmE6ng6CTn/gvGjK9DK5f8QQzF16', 'hi im sakura.x');

# TODO : finish tables >> blog & community
