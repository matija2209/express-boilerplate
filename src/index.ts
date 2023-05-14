import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { logger } from './lib/winston';
import { logError, returnError } from './utils/errors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import GDPRWebhookHandlers from "./gdpr";
import { MongoDBSessionStorage } from '@shopify/shopify-app-session-storage-mongodb';
import { shopifyApp } from '@shopify/shopify-app-express';
dotenv.config();

const app: Express = express();
const port = process.env.PORT;


const shopify = shopifyApp({
  api: {
    apiKey: 'd28ec4e5fc93c1a58e7a5c199a39c57e',
    apiSecretKey: '53b73d01b073e4ba2188a3047a3f02e8',
    scopes: ['read_content'],
    hostScheme: 'https',
    hostName: `7462-119-12-139-165.ngrok-free.app`,
  },

  auth: {
    path: '/api/auth',
    callbackPath: '/api/auth/callback',
  },
  webhooks: {
    path: '/api/webhooks',
  },
  sessionStorage: new MongoDBSessionStorage(
    "mongodb+srv://matija:tofore@cluster0.tmzmila.mongodb.net/?retryWrites=true&w=majority",
    'kurba'
  )
});

app.use((req, res, next) => {
    console.log(req.url);
    return next()
})

app.get("/api/products/count", async (req, res) => {
  const client = new shopify.api.clients.Rest({
    session:{
      accessToken:"shpua_20b02c85bf3828b164ccce259c545204",
      isOnline:false,
      shop:new URLSearchParams(new URL(req.headers.referer).search).get("shop"),
    }
  });
  const products = await client.get({
    path: 'pages',
    
  })
  return res.json(products)
  });
  
// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);



// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(shopify.cspHeaders());
// app.use("/*",proxy('https://localhost:5173'))
// app.use("/*",shopify.ensureInstalledOnShop())
app.use('/*',createProxyMiddleware({
    target: 'https://localhost:5173',
    // logLevel: 'debug',
    // cookieDomainRewrite: 'localhost',
    changeOrigin: false,
    secure: false,
    ws: false,
  }));



app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});


app.use(logError)
app.use(returnError)


process.on('uncaughtException', (error:any) => {
  logger.error(`server crashed — uncahught exception ${error.message} ${error.stack}`)
  process.exit(1); // mandatory (as per the Node.js docs)
});

process.on('unhandledRejection', (error:any) => {
  logger.error(`server crashed — unhandled rejection ${error.message} ${error.stack}`)
  process.exit(1); 
})

process.on('exit', (code) => {
  logger.info(`server shutdown ${code}`)
});

process.on('warning', (warning:any) => {
  logger.error("node warning",{warning})
});
