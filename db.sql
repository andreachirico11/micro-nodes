CREATE DATABASE `micro-node-auth`; #backtick compulsory

CREATE USER '<<  micro auth user  >>' @'%' IDENTIFIED BY '<< password >>';
GRANT ALL PRIVILEGES ON `micro-node-auth`.* TO '< < micro auth user > >' @'%';
FLUSH PRIVILEGES;

CREATE TABLE pingTests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE Users (
    _id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    dateAdd TIMESTAMP NOT NULL,
    password VARCHAR(255) NOT NULL,
    datePasswordChange TIMESTAMP,
    authToken VARCHAR(255),
    dateTokenExp TIMESTAMP,
    app_id INTEGER,
    refreshToken VARCHAR(255),
    dateRefTokenExp TIMESTAMP,
    resetToken VARCHAR(255),
    dateResetTokenExp TIMESTAMP
);

CREATE TABLE Apps (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    dateAdd DATETIME NOT NULL,
    passwordLenght INT NOT NULL,
    uppercaseLetters BOOLEAN NOT NULL,
    symbols BOOLEAN NOT NULL,
    numbers BOOLEAN NOT NULL,
    refreshToken BOOLEAN NOT NULL,
    canCheckWithApiKeyOnly BOOLEAN NOT NULL,
    symbolsRegex VARCHAR(255),
    tokenExpirationMs INT,
    refreshTokenExpirationMs INT,
    resetTokeExpirationMs INT,
    apiKey VARCHAR(255)
);

CREATE TABLE Admins (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    adminToken VARCHAR(255)
);

CREATE DATABASE `micro-static-files`;

CREATE USER '<<  micro static user  >>' @'%' IDENTIFIED BY '<< password >>';
GRANT ALL PRIVILEGES ON `micro-static-files`.* TO '< < micro static user > >' @'%';
FLUSH PRIVILEGES;

CREATE TABLE pingTests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE StaticFilesInfo (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    fileName VARCHAR(255) NOT NULL,
    filePath VARCHAR(255) NOT NULL,
    folderPath VARCHAR(255),
    type VARCHAR(255) NOT NULL,
    app_api_key VARCHAR(255),
    creation datetime DEFAULT CURRENT_TIMESTAMP
);