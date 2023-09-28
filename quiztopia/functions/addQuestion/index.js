const { sendResponse, sendError } = require('../../responses/index')
const { db } = require('../../services/db')
const middy = require('@middy/core');
const { validateToken } = require('../../middleware/auth');
const { validateAddQuestionSchema } = require('../../middleware/schema');
async function addQandAToQuiz(params, body, context) {

    const { Q, A, location } = body
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

        if (userName !== createdBy) {
            return sendError(403, { success: false, message: "You are not authorized to add question to this quiz" });
        }
        let params = {
            TableName: 'quizDb',
            Key: {
                'quizId': quizId
            }
        };

        let quiz = await db.get(params).promise();
        quiz.Item.questions.push({
            "Q": Q,
            "A": A,
            "location": location
        });

        params = {
            TableName: 'quizDb',
            Item: quiz.Item
        };

        await db.put(params).promise();
        return sendResponse(200, { success: true, message: "Question added" });     
    }
    catch (error) {
        console.log(error);
        return sendError(500, { success: false, message: "Could not add question" });
    }

}

module.exports.handler = middy()
    .use(validateToken)
   // .use(validateAddQuestionSchema)
    .handler(async (event, context) => {
        try {            
            return await addQandAToQuiz(event.pathParameters.quizId, JSON.parse(event.body), context);

        } catch (error) {
            console.log(error);
            return sendError(500, { success: false, message: "could not add question" });
        }
    });