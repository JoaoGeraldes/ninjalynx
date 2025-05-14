import { SETTINGS } from '@/configurations/settings';
import mongoose from 'mongoose';

export const MONGODB_SETTINGS = {
  URI:
    (process.env.NODE_ENV === 'development'
      ? SETTINGS.MONGODB.DEV_MONGODB_DATABASE
      : SETTINGS.MONGODB.PROD_MONGODB_DATABASE) || '',
};

// Mongo Schemas
const Schema = mongoose.Schema;

export async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) return; // If already connected

  try {
    await mongoose.connect(MONGODB_SETTINGS.URI, {
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
    });
    console.log('Connecting to database URI: ', MONGODB_SETTINGS.URI);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to the database');
  }
}

export const ItemSchema = new Schema(
  {
    date: { type: Date, default: Date.now },
    description: { type: String, index: 'text' },
    username: String,
    password: String,
  },
  { collection: 'items' }
);

export const ItemsModel =
  mongoose.models.items || mongoose.model('items', ItemSchema);

ItemsModel.syncIndexes();
