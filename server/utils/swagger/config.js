const swaggerJsdoc = require('swagger-jsdoc');
const YAML = require('yamljs');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API with Swagger',
      version: '1.0.0',
      description: 'This is a sample server.',
    },
  },
  apis: [], 
};

const config = swaggerJsdoc(options);


const articles = YAML.load('./server/utils/swagger/articles.yaml');

module.exports = {...config, ...articles};
