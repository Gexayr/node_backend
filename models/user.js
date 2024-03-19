const { v4: uuidv4 } = require('uuid');
const db = require('../database/db'); // Import the database connection

class User {
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
        this.updatedAt = new Date(); // Update updatedAt field with current date
    }

    static async findOne(uuid) {
        try {
            const [rows] = await db.promise().query('SELECT * FROM users WHERE uuid = ?', [uuid]);

            if (rows.length > 0) {
                const userData = rows[0];
                const user = new User(userData.username, userData.balance);
                user.uuid = userData.uuid;
                user.createdAt = userData.createdAt;
                user.updatedAt = userData.updatedAt;
                return user;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error retrieving user data:', error);
            throw error;
        }
    }


    // static async findOne(uuid) {
    //     console.log("findOne")
    //     try {
    //         const [rows] = await db.promise().query('SELECT * FROM users WHERE uuid = ?', [uuid]);
    //
    //         if (rows.length > 0) {
    //             const userData = rows[0]; // Assuming uid is unique, so we only take the first row
    //             console.log("user findOne");
    //
    //             return userData;
    //         } else {
    //             console.log('No data found for uuid:', uuid);
    //         }
    //     } catch (error) {
    //         console.error('Error retrieving user data:', error);
    //         throw error;
    //     }
    // }

    async save() {
        try {
            // Execute SQL query to insert user data into the database
            await db.promise().query('INSERT INTO users ' +
                '(uuid, username, balance, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)',
                [this.uuid, this.username, this.balance, this.createdAt, this.updatedAt]);

            const user = await User.findOne(this.uuid)
            return user;
        } catch (error) {
            console.error('Error saving user:', error);
            throw error;
        }
    }

}

module.exports = User;
