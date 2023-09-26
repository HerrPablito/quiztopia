const { sendResponse, sendError } = require('../../responses/index')
const { db } = require('../../services/db')
const middy = require('@middy/core');
const jwt = require('jsonwebtoken');
const { validateToken } = require('../../middleware/auth');

async function deleteQuiz(params, context) {
    const { quizId } = params;
    const userName = context.userName;
    
    
    //console.log("eller här: " + params);  
    try {    
        const { Items } = await db.scan({
            TableName: "eventsDb",
            FilterExpression: "attribute_exists(#DYNOBASE_artist)",
            ExpressionAttributeNames: {
                "#DYNOBASE_artist": "artist"
            }
            
        }).promise();
        myQuiz = JSON.stringify(Items);
        console.log("Items: " + myQuiz);         
    //     params = {
    //     TableName: process.env.QUIZ_TABLE,
    //     Key: {
    //         quizId: quizId
    //     }
    // }
    // console.log("nr1: " + params.createdBy);
    // console.log("nr2: " + quiz.Item.createdBy);
    // console.log("nr3: " + Item.createdBy);
    //console.log("nr4: " + params);
    if (userName !== quiz.Item.createdBy) {
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
    //console.log(quiz.Item.createdBy);
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
       // console.log("typ" + typeof event.pathParameters);
        //console.log(event.pathParameters);
        return await deleteQuiz(event.pathParameters.quizId, context);
        
    } catch (error) {
        console.log(error);
        return sendError(500, { success: false, message: "could not delete quiz" });
    }
    });