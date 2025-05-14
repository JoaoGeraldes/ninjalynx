import { FEATURE_FLAG } from '@/configurations/featureFlags';
import { connectToDatabase, ItemsModel } from '../utils';
import { NextRequest, NextResponse } from 'next/server';

const RESPONSE_MESSAGE = {
  invalidJSON: 'Invalid JSON format.',
  invalidFileType: 'Invalid file type.',
  successfulImport: 'Import completed successfully.',
  importFeatureDisabled: 'This feature (import database) is disabled.',
};

// Define the API handler
export async function POST(request: NextRequest) {
  try {
    if (!FEATURE_FLAG.allowImportDatabase) {
      return NextResponse.json(
        { error: RESPONSE_MESSAGE.importFeatureDisabled },
        { status: 400 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file || file.type !== 'application/json') {
      return NextResponse.json(
        { error: RESPONSE_MESSAGE.invalidFileType },
        { status: 400 }
      );
    }

    // Read file content
    const text = await file.text();
    const items = JSON.parse(text);

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: RESPONSE_MESSAGE.invalidJSON },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Remove existing (if any) database
    await ItemsModel.deleteMany({});

    // Add imported database
    await ItemsModel.insertMany(items);

    console.log('Users imported successfully', items);

    return NextResponse.json({
      message: RESPONSE_MESSAGE.successfulImport,
      count: items.length,
    });
  } catch (err) {
    console.error('Import failed:', err);

    //@ts-ignore
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}
