import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FreetCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as util from './util';
import LikeCollection from '../like/collection';
import SourceCollection from '../source/collection';

const router = express.Router();

/**
 * Get all the freets
 *
 * @name GET /api/freets
 *
 * @return {FreetResponse[]} - A list of all the freets sorted in descending
 *                      order by date modified
 */
/**
 * Get freets by author.
 *
 * @name GET /api/freets?authorId=id
 *
 * @return {FreetResponse[]} - An array of freets created by user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    if (req.query.author !== undefined) {
      next();
      return;
    }

    const allFreets = await FreetCollection.findAll();
    const response = allFreets.map(util.constructFreetResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    const authorFreets = await FreetCollection.findAllByUsername(req.query.author as string);
    const response = authorFreets.map(util.constructFreetResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new freet.
 *
 * @name POST /api/freets
 *
 * @param {string} content - The content of the freet
 * @return {FreetResponse} - The created freet
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isValidFreetContent
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const freet = await FreetCollection.addOne(userId, req.body.content);
    const likeObject = await LikeCollection.addOne(freet.id);
    const sourceObject = await SourceCollection.addOne(freet.id);

    res.status(201).json({
      message: 'Your freet was created successfully.',
      freet: util.constructFreetResponse(freet)
    });
  }
);

/**
 * Delete a freet
 *
 * @name DELETE /api/freets/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the freetId is not valid
 */
router.delete(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier
  ],
  async (req: Request, res: Response) => {
    await FreetCollection.deleteOne(req.params.freetId);
    await LikeCollection.deleteOne(req.params.freetId);
    await SourceCollection.deleteOne(req.params.freetId);
    res.status(200).json({
      message: 'Your freet was deleted successfully.'
    });
  }
);

/**
 * Modify a freet
 *
 * @name PUT /api/freets/:id
 *
 * @param {string} content - the new content for the freet
 * @return {FreetResponse} - the updated freet
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the freet
 * @throws {404} - If the freetId is not valid
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.put(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier,
    freetValidator.isValidFreetContent
  ],
  async (req: Request, res: Response) => {
    const freet = await FreetCollection.updateOne(req.params.freetId, req.body.content);
    res.status(200).json({
      message: 'Your freet was updated successfully.',
      freet: util.constructFreetResponse(freet)
    });
  }
);

// /**
//  * Like a freet
//  *
//  * @name POST /api/freets/like/:id
//  *
//  * @return {string} - A success message
//  * @throws {403} - If the user is not logged in
//  * @throws {404} - If the freetId is not valid
//  */
// router.post(
//   '/like/:freetId?',
//   [
//     userValidator.isUserLoggedIn,
//     freetValidator.isFreetExists
//   ],
//   async (req: Request, res: Response) => {
//     await FreetCollection.updateLikes(req.params.freetId, 1);
//     res.status(200).json({
//       message: 'You liked the freet successfully.'
//     });
//   }
// );

// /**
//  * Unlike a freet
//  *
//  * @name Delete /api/freets/like/:id
//  *
//  * @return {string} - A success message
//  * @throws {403} - If the user is not logged in
//  * @throws {404} - If the freetId is not valid
//  */
// router.post(
//   '/like/:freetId?',
//   [
//     userValidator.isUserLoggedIn,
//     freetValidator.isFreetExists
//   ],
//   async (req: Request, res: Response) => {
//     await FreetCollection.updateLikes(req.params.freetId, -1);
//     res.status(200).json({
//       message: 'You unliked the freet successfully.'
//     });
//   }
// );

// /**
//  * Hide the likes for a freet
//  *
//  * @name Put /api/freets/hide/:id
//  *
//  * @return {string} - A success message
//  * @throws {403} - If the user is not logged in
//  * @throws {404} - If the freetId is not valid
//  */
// router.put(
//   '/hide/:freetId?',
//   [
//     userValidator.isUserLoggedIn,
//     freetValidator.isFreetExists,
//     freetValidator.isValidFreetModifier
//   ],
//   async (req: Request, res: Response) => {
//     await FreetCollection.updateLikePrivacy(req.params.freetId, true);
//     res.status(200).json({
//       message: 'You have hidden like count for the freet.'
//     });
//   }
// );

// /**
//  * Unhide the likes for a freet
//  *
//  * @name Put /api/freets/unhide/:id
//  *
//  * @return {string} - A success message
//  * @throws {403} - If the user is not logged in
//  * @throws {404} - If the freetId is not valid
//  */
// router.put(
//   '/unhide/:freetId?',
//   [
//     userValidator.isUserLoggedIn,
//     freetValidator.isFreetExists,
//     freetValidator.isValidFreetModifier
//   ],
//   async (req: Request, res: Response) => {
//     await FreetCollection.updateLikePrivacy(req.params.freetId, false);
//     res.status(200).json({
//       message: 'You have unhidden like count for the freet.'
//     });
//   }
// );

export {router as freetRouter};
