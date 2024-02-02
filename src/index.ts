import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { logger } from './lib/winston';
import { logError, returnError } from './utils/errors';
import bodyParser from 'body-parser';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

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
