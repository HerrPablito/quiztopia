const { sendResponse, sendError } = require('../../responses/index')
const { db } = require('../../services/db')
const middy = require('@middy/core');


exports.handler = async (event, context) => {
    try {
      const result = await db
        .scan({
          TableName: process.env.DYNAMODB_QUIZ_TABLE,
        })
        .promise();
  
      const { Items: Quiz } = result;

        const quizResult = Quiz.map(quiz => ({ quizName: quiz.quizName, createdBy: quiz.createdBy }))
      return sendResponse(200, { success: true, quizResult });
    } catch (error) {
      console.log(error);
      return sendError(500, { success: false, message: 'Kunde inte hämta quiz.' });
    }
  };
  


