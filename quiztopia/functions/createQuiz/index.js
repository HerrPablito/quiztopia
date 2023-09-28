const { sendResponse, sendError } = require('../../responses/index')
const { db } = require('../../services/db')
const { v4: uuidv4 } = require('uuid');
const { validateToken } = require('../../middleware/auth');
const middy = require('@middy/core');
const {validateCreateQuizSchema} = require('../../middleware/schema');

async function createQuiz(body, context) {
    
    const quizId = uuidv4();
   
    const { quizName, questions } = body;
    try {

        const requiredFields = [
            'quizName',
            'questions',
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
                createdBy: context.userName
            }
        }).promise();

        return sendResponse(200, { success: true, quizId, quizName, questions, createdBy: context.userName });

    } catch (error) {
        console.log(error);
        return sendError(500, { success: false, message: "could not create quiz" });
    }
}

const handler = middy()
    //.use(validateToken)
    .use(validateCreateQuizSchema)
    .use(validateToken)
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