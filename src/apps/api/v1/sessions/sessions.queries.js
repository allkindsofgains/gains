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
 * ! TODO: instead of multiple db calls, use postgres json_agg func
 * It gets a session by its session id
 * @param sid - The session id
 * @returns An array of objects
 */
export async function getSessionBySessionId(sid) {
  let result = null;

  // session sets info
  const { rows: sets } = await db.raw(
    `
    select
	    e.name as name,
      e.id as "exercise_id",
	    gm.json->'notes' as "notes",
	    (select json_agg(s.* order by s.id)) as sets
    from
	    sets s
	    inner join exercises e on e.id = s.exercise_id
	    inner join gains_meta gm on (gm.json->'exercise_id')::int = e.id
    where (
        s.session_id = ?
        and (gm.json->'session_id')::int = ?
      )
    group by
	    s.session_id,
	    e.id,
	    gm.id
  `,
    [sid, sid],
  );

  // session with block info
  const joined = await db
    .select(
      '*',
      'sessions.name as name',
      'blocks.name as block_name',
      'sessions.end_date as end_date',
    )
    .from('sessions')
    .innerJoin('blocks', { 'blocks.id': 'sessions.block_id' })
    .where({ 'sessions.id': sid });

  // session without block info
  const notJoined = await db
    .select('*', 'sessions.end_date as end_date')
    .from('sessions')
    .where({ id: sid });

  if (!joined.length) {
    result = [
      {
        ...notJoined[0],
        logs: sets,
      },
    ];
  } else {
    result = [
      {
        ...joined[0],
        logs: sets,
      },
    ];
  }

  return result;
}

/**
 * Update a session in the database
 * @param sid - session id
 * @param uid - user id
 * @param body - {
 * @returns The updated session
 */
export async function updateSession(sid, uid, body) {
  return db
    .update(body)
    .from('sessions')
    .where({ id: sid })
    .andWhere({ user_id: uid })
    .returning('*');
}
