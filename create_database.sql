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
