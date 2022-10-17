import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import LikeCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as likeValidator from '../like/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get likes for a freet
 *
 * @name GET /api/freets/likecount/:id
 *
 * @return {string} - The number of likes
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the freetId is not valid
 */
router.get(
  '/likecount/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    const freetLikes = await LikeCollection.findOne(req.params.freetId);
    const numLikes = freetLikes.likes;
    res.status(200).json({
      message: `Total number of likes: ${numLikes}`
    });
  }
);

/**
 * Get likers for a freet
 *
 * @name GET /api/freets/likeusers/:id
 *
 * @return {string} - The usernames of users who liked a freet
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the freetId is not valid
 */
router.get(
  '/likeusers/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    const freetLikes = await LikeCollection.findOne(req.params.freetId);
    const names = freetLikes.likers;
    res.status(200).json({names});
  }
);

/**
 * Like a freet
 *
 * @name PUT /api/freets/like/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the freetId is not valid
 */
router.put(
  '/like/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    likeValidator.isAlreadyLiked
  ],
  async (req: Request, res: Response) => {
    await LikeCollection.updateLikes(req.params.freetId, 1, req.session.userId);
    res.status(200).json({
      message: 'You liked the freet successfully.'
    });
  }
);

/**
 * Unlike a freet
 *
 * @name Delete /api/freets/like/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the freetId is not valid
 */
router.delete(
  '/like/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    likeValidator.canUnlike
  ],
  async (req: Request, res: Response) => {
    await LikeCollection.updateLikes(req.params.freetId, -1, req.session.userId);
    res.status(200).json({
      message: 'You unliked the freet successfully.'
    });
  }
);

/**
 * Hide the likes for a freet
 *
 * @name Put /api/freets/hide/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the freetId is not valid
 */
router.put(
  '/hide/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier
  ],
  async (req: Request, res: Response) => {
    await LikeCollection.updateLikePrivacy(req.params.freetId, true);
    const freetLikes = await LikeCollection.findOne(req.params.freetId);
    const privateStatus = freetLikes.hiddenLikes ? 'Hidden' : 'Public';
    res.status(200).json({
      message: `You have hidden like count. The current status is ${privateStatus}`
    });
  }
);

/**
 * Unhide the likes for a freet
 *
 * @name Put /api/freets/unhide/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the freetId is not valid
 */
router.put(
  '/unhide/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier
  ],
  async (req: Request, res: Response) => {
    await LikeCollection.updateLikePrivacy(req.params.freetId, false);
    const freetLikes = await LikeCollection.findOne(req.params.freetId);
    const privateStatus = freetLikes.hiddenLikes ? 'Hidden' : 'Public';
    res.status(200).json({
      message: `You have unhidden like count. The current status is ${privateStatus}`
    });
  }
);

export {router as likeRouter};
