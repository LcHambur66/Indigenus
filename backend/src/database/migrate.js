import { readFile } from 'node:fs/promises';

export async function migrate(db) {
  const sql = await readFile(new URL('../../database.sql', import.meta.url), 'utf8');
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
