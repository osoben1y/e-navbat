import express from 'express';
import { connectDB} from './db/index.js';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import logger from './utils/logger/logger.js';
config();

process.on('uncaughtException', (err) => {
  console.log(`Uncaught exception: ${err}`);
  process.exit(1);
});

process.on('unhandledRejection', (reasion, promise) => {
  console.log(`Unhandled rejection: ${reasion}`);
});

const PORT = +process.env.PORT;
const app = express();

app.use(express.json());
app.use(cookieParser());

await connectDB();

app.use((err, req, res, next) => {
  if (err) {
    return res
      .status(500)
      .json({ message: 'Internal server error', error: err });
  } else {
    return next();
  }
});

app.listen(PORT, logger.info(`Server running on ${PORT} port`));