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
    servers: [
      {
        url: "https://codelist.ro/api",
      },
      {
        url: "http://localhost:8080/api",
      }
    ]
  },
  //apis: ['./server/utils/swagger/*.yaml']
  apis: [ './server/utils/swagger/main.yaml',
          './server/utils/swagger/problems.yaml',
          './server/utils/swagger/articles.yaml',
          './server/utils/swagger/solutions.yaml',
          './server/utils/swagger/data.yaml',
          './server/utils/swagger/auth.yaml',
        ]
};

const config = swaggerJsdoc(options);
module.exports = {...config};
