import db from '../../../../database/db.js';

/**
 * It takes a body object, inserts it into the sessions table, and returns the newly created session
 * @param body - an object containing the following properties:
 * @returns The session that was created
 */
export function createASession(body) {
  return db
    .insert({ ...body })
    .into('sessions')
    .returning('*');
}

/**
 * Get all sessions for a given user.
 * @param user_id - The user_id of the user whose sessions you want to retrieve.
 * @returns An array of objects
 */
export function getSessionsByUserId(user_id) {
  return db.select('*').from('sessions').where({ user_id }).orderBy('id', 'desc');
}

/**
 * It gets a session by its session id
 * @param sid - The session id
 * @returns An array of objects
 */
export async function getSessionBySessionId(sid) {
  const joined = await db
    .select('*', 'sessions.name as name', 'blocks.name as block_name')
    .from('sessions')
    .innerJoin('blocks', { 'blocks.id': 'sessions.block_id' })
    .where({ 'sessions.id': sid });

  if (!joined.length) {
    return db.select('*').from('sessions').where({ id: sid });
  }

  return joined;
}
