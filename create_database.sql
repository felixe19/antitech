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
    Bio TEXT
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

# TODO >> hardcode info into these two : user & book !
