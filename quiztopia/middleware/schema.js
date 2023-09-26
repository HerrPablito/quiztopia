const Joi = require('joi');

// Definiera ditt schema med Joi
const schema = Joi.object({
  quizName: Joi.string().required(),
  questions: Joi.array().items(
    Joi.object({
      Q: Joi.string().required(),
      A: Joi.string().required()
    })
  ).required()
});

module.exports = () => {
  return {
    before: (handler, next) => {
      // Validera inkommande data mot schemat
      const { error } = schema.validate(handler.event.body);

      // Om det finns ett fel, kasta det så att det kan hanteras av ett felhanteringsmiddleware
      if (error) {
        throw new Error(`Validation error: ${error.details[0].message}`);
      }

      next();
    }
  }
}