const jwt = require('jsonwebtoken');

const validateToken = {
    before: async (request) => {
        try {
            const token = request.event.headers.authorization.replace('Bearer ', '');
            console.log(token);
            if (!token) {
                return {
                    statusCode: 401,
                    body: JSON.stringify({
                        success: false,
                        message: 'Unauthorized'
                    })
                }
            }

            const data = jwt.verify(token, "Nelson123");
            request.event.userName = data.userName;
            request.event.userId = data.userId;

            return request.response;

        } catch (error) {
            throw new Error('401 Unauthorized');
            
            request.event.error = "401 Unauthorized";
            return request.response;
        }
    },
    onError: async (error) => {
        return {
            statusCode: 401,
            body: JSON.stringify({
                success: false,
                message: "Wrong token"
            })
        }
    }
};

module.exports = { validateToken };