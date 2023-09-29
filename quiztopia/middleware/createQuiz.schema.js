const Joi = require('joi');

const validateSchema = {
    
    before: async (request) => {

        const parsedRequest = JSON.parse(request.event.body);

        try {
            const schema = Joi.object({
                quizName: Joi.string().required(),
                questions: Joi.array().items(
                    Joi.object({
                        Q: Joi.string().required(),
                        A: Joi.string().required(),
                        location: Joi.string().required(),
                    }).options({ allowUnknown: false })
                ).required()
            });
            
            const result = schema.validate(parsedRequest);
            
            // if (!result) {
            //     request.context.error = {message: "Wrong input"};
            //     return result.response
            
            // }

            if (result.error){
                // console.log("test här");
                // console.log("här:"+ result.error);
                throw new Error("Wrong input");
                
            }
        } catch (error) {
            // console.log("test här 2");
            // console.log(error);
            
            throw new Error("wrong input");          
        }
    }
}


module.exports = { validateSchema };

