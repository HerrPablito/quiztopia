const { sendResponse, sendError } = require('../../responses/index')
const { db } = require('../../services/db')
//const { v4: uuidv4 } = require('uuid');
const middy = require('@middy/core');
//const { validateToken } = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const { comparePassword } = require('../../middleware/bcrypt');   


async function login(user) {
    const { userName, password } = user;

    const { Item } = await db.get({
        TableName: 'usersDb',
        Key: {
            userName: userName
        }
    }).promise();
    console.log(Item.userName)
    const correctPassword = await comparePassword(password, Item.password);
        if (!user || !correctPassword) {
            throw new Error('Wrong Token or login');
        }
        if (!Item) {
            throw new Error('User not found');
        }
            const token = jwt.sign({ userName: Item.userName }, "Nelson123", { expiresIn: 10000 });

            return sendResponse (200, { success: true, userName: userName, token: token });
       
}


module.exports.handler = middy(async (event, context) => {
    // console.log(event)
    // console.log(context)
    try {
        return await login(JSON.parse(event.body));
    } catch (error) {
        console.log(error);
        return sendError(500, { success: false, message: "could not login" });
    }
});