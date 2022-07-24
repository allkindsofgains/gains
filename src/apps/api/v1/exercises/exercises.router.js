import * as ExercisesController from './exercises.controller.js';
import * as ExercisesValidation from './exercises.validation.js';
import { catchAsyncErrors, validator } from '../../api.middlewares.js';

import express from 'express';
const exercises = express.Router();

/**
 * GET /api/v1/exercises
 * @tags exercises
 * @summary get a list of all the exercises
 */

/**
 * GET /api/v1/exercises?user_id={uid}
 * @tags exercises
 * @summary get a list of all the exercises of a user
 * @param {string} uid.path.required - the user_id - application/x-www-form-urlencoded
 */

/**
 * GET /api/v1/exercises?exercise_category_id={ecid}
 * @tags exercises
 * @summary get a list of all the exercises of a user exercise category
 * @param {string} ecid.path.required - the exercise_category_id - application/x-www-form-urlencoded
 */
exercises.get(
  '/',
  validator(ExercisesValidation.getExercises),
  catchAsyncErrors(ExercisesController.getExercises),
);

/**
 * GET /api/v1/exercises/{eid}
 * @tags exercises
 * @summary get details of a exercise
 * @param {number} eid.path.required - the exercise id - application/x-www-form-urlencoded
 */
exercises.get(
  '/:eid',
  validator(ExercisesValidation.getExercise),
  catchAsyncErrors(ExercisesController.getExercise),
);

/**
 * POST /api/v1/exercises
 * @tags exercises
 * @summary create an exercise
 * @param {string} name.form.required - the name - application/x-www-form-urlencoded
 * @param {number} exercise_category_id.form.required - the exercise_category_id - application/x-www-form-urlencoded
 * @param {number} user_id.form.required - the user_id - application/x-www-form-urlencoded
 */
exercises.post(
  '/',
  validator(ExercisesValidation.postExercise),
  catchAsyncErrors(ExercisesController.postExercise),
);

/**
 * PATCH /api/v1/exercises/{eid}/sessions/{sid}/update-exercise-note/{gmid}
 * @tags exercises
 * @summary update exercise set notes
 * @param {number} eid.form.required - the exercise id - application/x-www-form-urlencoded
 * @param {number} sid.form.required - the session id - application/x-www-form-urlencoded
 * @param {number} gmid.form.required - the gains meta id - application/x-www-form-urlencoded
 * @param {json} json.form.required - the json - application/x-www-form-urlencoded
 */
exercises.patch(
  '/:eid/sessions/:sid/update-exercise-note/:gmid',
  validator(ExercisesValidation.patchExerciseNote),
  catchAsyncErrors(ExercisesController.patchExerciseNote),
);

export default exercises;
