const swaggerJsdoc = require('swagger-jsdoc');
const YAML = require('yamljs');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Codelist API',
      version: '1.0.0',
      description: 'List of endpoints used for communicating with Codelist with HTTP Requests',
    },
  },
  apis: [], 
};

const config = swaggerJsdoc(options);


const articles = YAML.load('./server/utils/swagger/articles.yaml');

module.exports = {...config, ...articles};
