import { DatabaseItem } from '@/types/types';
import mongoose from 'mongoose';
import { connectToDatabase, ItemsModel, MONGODB_SETTINGS } from './utils';
import { SETTINGS } from '@/configurations/settings';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);

    let items;

    items = await getItems(ItemsModel, searchParams);

    return Response.json(items);
  } catch (e) {
    return Response.json({});
  }
}

export async function POST(req: Request) {
  try {
    // Connect to the database
    await connectToDatabase();

    const requestPayload: DatabaseItem = await req.json();

    const newItem = new ItemsModel({
      ...requestPayload,
    });

    await newItem.save();

    return Response.json(newItem);
  } catch (e) {
    return Response.json(e, { status: 409 });
  }
}

export async function PATCH(req: Request) {
  try {
    const requestPayload: DatabaseItem = await req.json();

    if (!requestPayload._id)
      return Response.json(
        { error: "Missing data. Can't update item" },
        { status: 409 }
      );

    // Connect to the database
    await connectToDatabase();

    const id = requestPayload?._id;

    const updatedResult = await updateItem(ItemsModel, id, requestPayload);

    return Response.json(updatedResult);
  } catch (e) {
    return Response.json(e, { status: 409 });
  }
}

export async function DELETE(req: Request) {
  try {
    const requestPayload: { itemId: string } = await req.json();

    if (!requestPayload.itemId)
      return Response.json(
        { error: "Missing item id. Can't delete item" },
        { status: 409 }
      );

    // Connect to the database
    await connectToDatabase();

    const id = requestPayload?.itemId;

    await deleteItem(ItemsModel, id);

    return Response.json(requestPayload);
  } catch (e) {
    return Response.json(e, { status: 409 });
  }
}

async function updateItem(
  model: mongoose.Model<any>,
  id: string,
  updateData: Partial<DatabaseItem>
) {
  try {
    const updatedResult = await model.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    return updatedResult;
  } catch (error) {
    console.error('Error updating item:', error);
    return error;
  }
}

async function deleteItem(model: mongoose.Model<any>, id: string) {
  try {
    const deletedItem = await model.findByIdAndDelete(id);
    if (!deletedItem) {
      throw new Error('Document not found');
    }

    return deletedItem;
  } catch (error) {
    console.error('Error deleting entry:', error);
    throw error;
  }
}

async function getItems(
  model: mongoose.Model<any>,
  searchParams: URLSearchParams,
  limit = SETTINGS.MONGODB.ITEMS_PER_RESPONSE
) {
  const descriptionSearchParam = searchParams?.get('description');
  const cursorQuerySearchParam = searchParams?.get('cursor');
  const lastCursorSearchParam = searchParams?.get('last_cursor');

  let items = null;

  const mongoQuery = () => {
    let query: Record<string, any> = {};

    if (descriptionSearchParam && descriptionSearchParam !== 'undefined') {
      query.description = { $regex: descriptionSearchParam, $options: 'i' };
    }

    if (cursorQuerySearchParam && cursorQuerySearchParam !== 'undefined') {
      query._id = { $lt: cursorQuerySearchParam };
    }

    return query;
  };

  // When this param is present, we just respond the last cursor (item id) for pagination purposes.
  if (lastCursorSearchParam) {
    const item = await model
      .findOne({ ...mongoQuery() })
      .sort('asc')
      .limit(1);

    return { cursor: item?._id || null };
  }

  // Fetch starting at `cursor` and endint at `limit`
  items = await model
    .find({ ...mongoQuery() })
    .sort({ _id: -1 })
    .limit(limit);

  return items;
}
