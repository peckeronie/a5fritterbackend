import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import SourceCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as sourceValidator from '../source/middleware';

const router = express.Router();

/**
 * Get all sources from a freet
 *
 * @name GET /api/source/sources/:id
 *
 * @return {SourceResponse[]} - An array of sources for the freet with freetID
 * @throws {403} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
router.get(
  '/sources/:freetId?',
  [
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    const response = await SourceCollection.findSourcesByFreet(req.params.freetId);
    res.status(200).json(response);
  }
);

/**
 * Add source to a freet
 *
 * @name POST /api/source/addsource/:id
 *
 * @param {string} source - the new source to be added
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the freetId is not valid
 */
router.post(
  '/addsource/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    sourceValidator.isValidSource
  ],
  async (req: Request, res: Response) => {
    await SourceCollection.addSource(req.params.freetId, req.body.source);
    res.status(200).json({
      message: 'You added a source successfully.'
    });
  }
);

/**
 * Remove source from a freet
 *
 * @name PUT /api/source/delsource/:id
 *
 * @param {string} source - the source to be removed
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the freetId is not valid
 */
router.put(
  '/delsource/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    await SourceCollection.removeSource(req.params.freetId, req.body.source);
    res.status(200).json({
      message: 'You removed the source successfully.'
    });
  }
);

// /**
//  * Get all sources from a freet
//  *
//  * @name GET /api/freets/sources/:id
//  *
//  * @return {SourceResponse[]} - An array of sources for the freet with freetID
//  * @throws {403} - If authorId is not given
//  * @throws {404} - If no user has given authorId
//  *
//  */
// router.get(
//   '/sources/:freetId?',
//   [
//     freetValidator.isFreetExists
//   ],
//   async (req: Request, res: Response) => {
//     const response = await SourceCollection.findSourcesByFreet(req.params.freetId);
//     res.status(200).json(response);
//   }
// );

// /**
//  * Add source to a freet
//  *
//  * @name POST /api/freets/addsource/:source/:id
//  *
//  * @return {string} - A success message
//  * @throws {403} - If the user is not logged in
//  * @throws {404} - If the freetId is not valid
//  */
// router.post(
//   '/addsource/:source/:freetId?',
//   [
//     userValidator.isUserLoggedIn,
//     freetValidator.isFreetExists
//   ],
//   async (req: Request, res: Response) => {
//     await SourceCollection.addSource(req.params.freetId, req.params.source);
//     res.status(200).json({
//       message: 'You added a source successfully.'
//     });
//   }
// );

// /**
//  * Remove source from a freet
//  *
//  * @name DELETE /api/freets/delsource/:source/:id
//  *
//  * @return {string} - A success message
//  * @throws {403} - If the user is not logged in
//  * @throws {404} - If the freetId is not valid
//  */
// router.delete(
//   '/delsource/:source/:freetId?',
//   [
//     userValidator.isUserLoggedIn,
//     freetValidator.isFreetExists
//   ],
//   async (req: Request, res: Response) => {
//     await SourceCollection.removeSource(req.params.freetId, req.params.source);
//     res.status(200).json({
//       message: 'You removed the source successfully.'
//     });
//   }
// );

export {router as sourceRouter};
