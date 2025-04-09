// Main application configuration
require('dotenv').config();

const config = {
  // Server configuration
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Domain configuration
  domain: {
    name: 'Canteen42.com',
    registrar: 'Namecheap.com'
  },
  
  // Dropshipping suppliers
  suppliers: {
    oberlo: {
      enabled: process.env.OBERLO_ENABLED === 'true',
      apiKey: process.env.OBERLO_API_KEY
    },
    spocket: {
      enabled: process.env.SPOCKET_ENABLED === 'true',
      apiKey: process.env.SPOCKET_API_KEY
    },
    dsers: {
      enabled: process.env.DSERS_ENABLED === 'true',
      apiKey: process.env.DSERS_API_KEY
    },
    cjDropshipping: {
      enabled: process.env.CJ_DROPSHIPPING_ENABLED === 'true',
      apiKey: process.env.CJ_DROPSHIPPING_API_KEY
    },
    alibaba: {
      enabled: process.env.ALIBABA_ENABLED === 'true',
      apiKey: process.env.ALIBABA_API_KEY
    }
  },
  
  // CORS configuration
  corsOptions: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://canteen42.com', 'https://*.manus.space'] 
      : ['http://localhost:3000', 'http://localhost:8080'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }
};

module.exports = config;
