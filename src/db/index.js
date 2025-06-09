import { connect } from 'mongoose';

export const connectDB = async () => {
  try {
    await connect(process.env.MONGO_URI);
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
  }
};
