const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { configDotenv } = require('dotenv');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const userRoutes = require('./router/router'); // Corrected path
const postRoutes = require('./router/userrouter'); // Corrected path
const db = require('./db/db');

const app = express();

// Load environment variables from .env file
configDotenv();

// Use the port from environment variables or default to 3000
const Port = process.env.PORT || 3000;

// Swagger setup
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Social Media API',
            version: '1.0.0',
            description: 'API for Social Media Application',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{
            bearerAuth: []
        }],
    },
    apis: ['./router/*.js', './router/userRouter.js','./jwt.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));

// Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api/users', userRoutes);
app.use('/api', postRoutes); 

// Start the server
app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
});
