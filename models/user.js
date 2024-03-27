"use strict";

const {v4: uuidv4} = require('uuid');
// const db = require('../database/db'); // Import the database connection
const pool = require('../database/db');
const Game = require('./game');

class User {

    constructor(
        username,
        balance,
        uuid = null,
        createdAt = null,
        updatedAt = null,
        id = null
    ) {
        this.uuid = uuid ? uuid : uuidv4();
        this.username = username;
        this.balance = balance;
        this.createdAt = createdAt ? createdAt : new Date();
        this.updatedAt = updatedAt ? updatedAt : new Date();
        this.id = id ?? id;
    }


    // method for change balance
    changeBalance(amount) {
        this.balance += amount;
    }

    static async findOne(uuid) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                } else {
                    connection.query('SELECT * FROM users WHERE uuid = ?', [uuid], (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.release();
                    });
                }

            });
        })
            .then(function (res) {
                const userData = res[0];
                return new User(userData.username, userData.balance, userData.uuid, userData.createdAt, userData.updatedAt, userData.id);
            })
            .catch(function (error) {
                console.log('///////////ERROR Find///////////');
                console.log(error);
            });
    }

    async save(data = null) {
        try {
            return new Promise((resolve, reject) => {
                pool.getConnection((err, connection) => {
                    if (err) {
                        reject(err);
                    } else {
                        if(!!data) {
                            connection.query('UPDATE users SET balance = ?, updatedAt = ? WHERE uuid = ?',
                                [this.balance, new Date(), this.uuid], (err, result) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        resolve(this.uuid);
                                    }
                                    connection.release();
                                });
                        } else {
                            connection.query('INSERT INTO users ' +
                                '(uuid, username, balance, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)',
                                [this.uuid, this.username, this.balance, this.createdAt, this.updatedAt], (err, rows) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        resolve(this.uuid);
                                    }
                                    connection.release();
                                });
                        }
                    }

                });
            })
                .then(function (uuid) {
                    return User.findOne(uuid)
                })
                .catch(function (error) {
                    console.log('///////////ERROR Save///////////');
                    console.log(error);
                });

        } catch (error) {
            console.error('Error saving user:', error);
            throw error;
        }
    }

    async updateData(data, amount) {
        try {
            this.balance = data.balance;
            this.changeBalance(amount)
            return await this.save(data);
        } catch (error) {
            console.error('Error saving user:', error);
            throw error;
        }
    }

}

module.exports = User;
