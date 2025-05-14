import { DatabaseItem } from '@/types/types';
import { getCookie } from '@/utils/utils';

interface QueryParams {
  description: string | null;
  cursor: string | null;
  lastCursor?: boolean;
}

/**
 * Get all items
 * `GET /api`
 */
export async function getItems(
  queryParams: QueryParams
): Promise<(DatabaseItem[] & { cursor?: string }) | null> {
  try {
    let query = '?';

    if (!!queryParams.cursor?.length) query += `cursor=${queryParams.cursor}&`;

    if (!!queryParams.description?.length)
      query += `description=${queryParams.description}&`;

    if (queryParams.lastCursor) query += `last_cursor=retrieve`;

    const response = await fetch('/api' + query, {
      headers: {
        Authorization: `Bearer ${getCookie()}`,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching passwords:', error);
    return null;
  }
}

export async function getAuthentication(): Promise<{
  authenticated?: boolean;
} | null> {
  try {
    const response = await fetch('/api/authentication', {
      headers: {
        Authorization: `Bearer ${getCookie()}`,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching authentication:', error);
    return null;
  }
}

export async function getLastCursorId(): Promise<string | null> {
  try {
    const response = await fetch('/api?last_cursor=retrieve', {
      headers: {
        Authorization: `Bearer ${getCookie()}`,
      },
    });
    // if (!response.ok) throw new Error('Failed to fetch passwords');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching passwords:', error);
    return null;
  }
}

export async function downloadDatabase(): Promise<void | null> {
  try {
    const response = await fetch('/api/export', {
      headers: {
        Authorization: `Bearer ${getCookie()}`,
        'Cache-Control': 'no-store',
      },
    });
    if (!response.ok) throw new Error('Failed to download.');
    const data = await response.json();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `${new Date().toLocaleDateString()}_ninjalynx_database_backup.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Clean up the object URL
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Error fetching passwords:', error);
    return null;
  }
}

/**
 * Update an item
 * `PATCH /api`
 */
export async function updateItem(
  requestPayload: DatabaseItem
): Promise<DatabaseItem | null> {
  try {
    const response = await fetch('/api', {
      method: 'PATCH',
      body: JSON.stringify(requestPayload),
      headers: {
        Authorization: `Bearer ${getCookie()}`,
      },
    });

    const json = (await response.json()) as DatabaseItem;

    return json;
  } catch (error) {
    console.error('Error updating an item:', error);
    return null;
  }
}

/**
 * Delete an item
 * `DELETE /api`
 *
 * When successful, the response payload matches the request payload exactly.
 */
export async function deleteItem(requestPayload?: {
  itemId?: string;
}): Promise<{ itemId: string } | null> {
  try {
    if (!requestPayload?.itemId)
      throw new Error("102: Can't delete. Missing item id.");

    const response = await fetch('/api', {
      method: 'DELETE',
      body: JSON.stringify(requestPayload),
      headers: {
        Authorization: `Bearer ${getCookie()}`,
      },
    });

    const json = await response.json();

    return json;
  } catch (error) {
    console.error('Error updating an item:', error);
    return null;
  }
}

/**
 * Create an item
 * `POST /api`
 */
export async function createItem(
  requestPayload: DatabaseItem
): Promise<DatabaseItem | null> {
  try {
    const response = await fetch('/api', {
      method: 'POST',
      body: JSON.stringify(requestPayload),
      headers: {
        Authorization: `Bearer ${getCookie()}`,
      },
    });

    const item = (await response.json()) as DatabaseItem;

    return item;
  } catch (error) {
    console.error('Error updating an item:', error);
    return null;
  }
}

export async function importDatabase(formData: FormData) {
  try {
    const request = await fetch('/api/import', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${getCookie()}`,
      },
    });

    const response = (await request.json()) as {
      message: string;
      count: number;
    };

    return response;
  } catch (error) {
    console.error('Error updating an item:', error);
    return null;
  }
}
