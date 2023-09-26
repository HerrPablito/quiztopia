const { sendResponse, sendError } = require('../../responses/index')
const { db } = require('../../services/db')
const middy = require('@middy/core');
const jwt = require('jsonwebtoken');
const { validateToken } = require('../../middleware/auth');

async function deleteQuiz(params, context) {
  try {    
    
    console.log("här: " + context.userName);
    const userName = context.userName;
    
        params = {
        TableName: process.env.QUIZ_NAME,
        Key: {
            quizId: quizId
        }
    }


    const quiz = await db.get(params).promise();

    if (!quiz.Item) {
      return sendError(404, { success: false, message: "Quiz not found" });
    }
    console.log(quiz.Item.createdBy);
  }
 catch (error) {
    console.log(error);
    return sendError(500, { success: false, message: "Could not delete quiz" });
  }

}



module.exports.handler = middy() 
    .use(validateToken)
    .handler(async (event, context) => {
    try {
        return await deleteQuiz(JSON.parse(event.pathParameters), context);
    } catch (error) {
        console.log(error);
        return sendError(500, { success: false, message: "could not delete quiz" });
    }
    });