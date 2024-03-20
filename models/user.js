const {v4: uuidv4} = require('uuid');
// const db = require('../database/db'); // Import the database connection
const pool = require('../database/db');

class User {

    steps = {
        1:10,
        2:20,
        3:50,
        4:100
    }

    constructor(username, balance) {
        this.uuid = uuidv4();
        this.username = username;
        this.balance = balance;
        this.createdAt = new Date(); // Initialize createdAt field with current date
        this.updatedAt = new Date(); // Initialize updatedAt field with current date
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
                return res[0];
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
                            console.log(data)
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

    async updateData(data, userData) {
        try {
            this.changeBalance(-this.steps[data?.step])
            this.uuid = userData.uuid;
            this.createdAt = userData.createdAt;
            this.updatedAt = userData.updatedAt;
            return await this.save(data);
        } catch (error) {
            console.error('Error saving user:', error);
            throw error;
        }
    }

}

module.exports = User;
