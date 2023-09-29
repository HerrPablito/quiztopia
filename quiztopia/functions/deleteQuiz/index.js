const { sendResponse, sendError } = require('../../responses/index')
const { db } = require('../../services/db')
const middy = require('@middy/core');
const { validateToken } = require('../../middleware/auth');

async function deleteQuiz(params, context) {
   
    const quizId = params;
    const userName = context.userName; 
    try {    
        const { Item } = await db.get({
            TableName: "quizDb",
            Key: {
                quizId: quizId
            }
        }).promise();

        const createdBy = Item.createdBy;
        console.log("createdBy: " + createdBy);
     
    if (userName !== createdBy) {
        return sendError(403, { success: false, message: "You are not authorized to delete this quiz" });
    }
            await db.delete({
            TableName: "quizDb",
            Key: {
                quizId: quizId
            }
        }).promise();
    return sendResponse(200, { success: true, message: "Quiz deleted" });
    //const quiz = await db.get(params).promise();

    if (!quiz.Item) {
      return sendError(404, { success: false, message: "Quiz not found" });
    }

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
        return await deleteQuiz(event.pathParameters.quizId, context);
        
    } catch (error) {
        console.log(error);
        return sendError(500, { success: false, message: "could not delete quiz" });
    }
    });