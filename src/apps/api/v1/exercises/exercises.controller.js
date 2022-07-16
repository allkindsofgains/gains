import * as ExercisesQueries from './exercises.queries.js';
import { StatusCodes } from 'http-status-codes';
import logger from '../../../../libs/logger.js';
import CustomError from '../../api.errors.js';
import * as ExerciseCategoriesQueries from '../exercise-categories/exercise-categories.queries.js';

export async function getExercises(req, res) {
  const uid = req.query.user_id;
  const ecid = req.query.exercise_category_id;

  // when called via /api/v1/exercises?exercise_category_id=1
  if (ecid) {
    const userExercisesByCategory =
      await ExerciseCategoriesQueries.getExercisesByExerciseCategoryId(ecid);

    if (!userExercisesByCategory.length) throw new CustomError.BadRequestError(`There are no exercises available for category id ${ecid}!`); // prettier-ignore

    return res.status(StatusCodes.OK).json({
      status: 'success',
      request_url: req.originalUrl,
      message: 'The resource was returned successfully!',
      data: userExercisesByCategory,
    });
  }

  // when called via /api/v1/exercises?user_id=1
  if (uid) {
    const userExercises = await ExercisesQueries.getExerciseByUserId(uid);

    if (!userExercises.length) throw new CustomError.BadRequestError(`There are no exercises available for user id ${uid}!`); // prettier-ignore

    return res.status(StatusCodes.OK).json({
      status: 'success',
      request_url: req.originalUrl,
      message: 'The resource was returned successfully!',
      data: userExercises,
    });
  }

  // when called via /api/v1/exercises
  const exercises = await ExercisesQueries.getAllExercises();

  if (!exercises.length) throw new CustomError.BadRequestError(`There are no exercises available currently!`); // prettier-ignore

  return res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: exercises,
  });
}

/**
 * It creates a new exercise for a user
 * @param req - The request object.
 * @param res - The response object.
 */
export async function postExercise(req, res) {
  const body = req.body;
  const created = await ExercisesQueries.createExercise(body);

  if (!created.length) throw new CustomError.BadRequestError(`Something went wrong while creating a exercise for  User ID: ${body.user_id}!`); // prettier-ignore

  logger.info(`User id: ${body.user_id} has created a exercise id: ${created[0].id}`);

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was created successfully!',
    data: created,
  });
}
