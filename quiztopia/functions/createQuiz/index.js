const { sendResponse, sendError } = require('../../responses/index')
const { db } = require('../../services/db')
const { v4: uuidv4 } = require('uuid');
//const moment = require('moment');
const { validateToken } = require('../../middleware/auth');
const middy = require('@middy/core');
//const httpJsonBodyParser = require('@middy/http-json-body-parser')
//const validator = require('@middy/validator')
//const { createQuizSchema } = require('../../middleware/schema')
const {validateSchema} = require('../../middleware/schema');

async function createQuiz(body, context) {
  //  console.log("här: " + userName)
   // console.log("eller här: " + data.username)
    //const userName = data.userName;
    const quizId = uuidv4();
   
    const { quizName, questions } = body;
    try {
     const location = "111.111.111.111"    
        const requiredFields = [
            'quizName',
            'questions'
        ];

        if (!body) {
            return sendError(400, { success: false, message: "missing body" });
        }
        if (!requiredFields.every((field) => field in body)) {
            return sendError(400, { success: false, message: "missing required fields" });
        }


        await db.put({
            TableName: "quizDb",
            Item: {
                // PK: `EVENT#${eventId}`,
                //SK: `EVENT#${eventId}`,
                quizId: quizId,
                quizName: quizName,
                questions: questions,
                location: location,
                createdBy: context.userName
            }
        }).promise();

        return sendResponse(200, { success: true, quizId, quizName, questions, location, createdBy: context.userName });

    } catch (error) {
        console.log(error);
        return sendError(500, { success: false, message: "could not create quiz" });
    }
}

const handler = middy()
    .use(validateToken)
    .use(validateSchema)
    .handler(async (event, context) => {
        try {
            return await createQuiz(JSON.parse(event.body), context);
        } catch (error) {
            console.log(error);
            return sendError(500, { success: false, message: "could not create quiz" });
        }
    }
    
    );

module.exports = { handler }