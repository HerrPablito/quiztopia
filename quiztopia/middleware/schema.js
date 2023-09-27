const Joi = require('joi');

const validateSchema = {
    before: async (request) => {
        try {
            const schema = Joi.object({
                quizName: Joi.string().required(),
                questions: Joi.array().items(
                    Joi.object({
                        Q: Joi.string().required(),
                        A: Joi.string().required(),
                        location: Joi.string().required(),
                    })
                ).required()
            });

        } catch (error) {
            throw new Error('401 Unauthorized');

            request.event.error = "401 Unauthorized";
            return request.response;
        }
        onError: async (error) => {
            return {
                statusCode: 401,
                body: JSON.stringify({
                    success: false,
                    message: "Wrong input"
                })
            }
        }
    }

}
module.exports = { validateSchema };

