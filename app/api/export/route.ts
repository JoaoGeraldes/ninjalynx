import { connectToDatabase, ItemsModel } from '../utils';

// Define the API handler
export async function GET() {
  try {
    // Connect to the database
    await connectToDatabase();

    // Fetch all data from the collection
    const data = await ItemsModel.find({}).lean(); // `.lean()` returns plain JavaScript objects

    // Convert the data to JSON
    const jsonString = JSON.stringify(data, null, 2);

    // Set headers to indicate a downloadable file
    return new Response(jsonString, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename=collection.json',
        'Cache-Control':
          'no-store, no-cache, max-age=0, must-revalidate, proxy-revalidate',
      },
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return Response.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
