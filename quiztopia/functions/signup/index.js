const { sendResponse, sendError } = require('../../responses/index')
const { db } = require('../../services/db')
const { v4: uuidv4 } = require('uuid');
//const bcrypt = require('bcryptjs');
const { hashPassword } = require('../../middleware/bcrypt');


exports.handler = async (event, context) => {
    
    const { userName, password} = JSON.parse(event.body)

    try {
        const userId = uuidv4();
        const pass = await hashPassword(password)
        await db.put({
            TableName: "usersDb",
            Item: {
                userName: userName,                
                password: pass,
                userId: userId
            }
        }).promise();
        
        return sendResponse(200, { success: true, userName: userName, userId: userId, password: pass });

    } catch (error) {
        console.log(error);
        return sendError(500, { success: false, message: "could not create account" });
    }

}