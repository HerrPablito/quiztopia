const { sendResponse, sendError } = require('../../responses/index')
const { db } = require('../../services/db')
const { validateToken } = require('../../middleware/auth');
const middy = require('@middy/core');


async function updateQuiz(body, context) {

    try {
        
    } catch (error) {
        
    }
 }

const handler = middy()
    .use(validateToken)
    .handler(async (event, context) => {
        try {
            return await updateQuiz(JSON.parse(event.body), context);
        } catch (error) {
            console.log(error);
            return sendError(500, { success: false, message: "could not update quiz" });
        }
    });

module.exports = { handler }