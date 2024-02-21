import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

export const connectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `\n Mongo DB Connected successfully at Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error(`MongoDb connection failed: ${error}`);
    process.exit(1);
  }
};
