import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FollowCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as followValidator from '../follow/middleware';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';
import * as util from '../freet/util';

const router = express.Router();

/**
 * Get followers for a user
 *
 * @name GET /api/follow/follows/:userName
 *
 * @return {string} - The followers for the user
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the user does not exist
 */
router.get(
  '/follows/:userName?',
  [
    userValidator.isUserLoggedIn,
    followValidator.isUserExists
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOneByUsername(req.params.userName);
    const userId = user._id;
    const followObj = await FollowCollection.findOne(userId);
    if (req.session.userId !== userId.toString() && followObj.isHidden) {
      res.status(200).json({
        message: 'Followers are currently hidden'
      });
    } else {
      const response = await FollowCollection.getFollows(user._id);
      res.status(200).json({response});
    }
  }
);

/**
 * Get accounts being followed by a user
 *
 * @name GET /api/follow/following/:userName
 *
 * @return {string} - The following list for the user
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the user does not exist
 */
router.get(
  '/following/:userName?',
  [
    userValidator.isUserLoggedIn,
    followValidator.isUserExists
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOneByUsername(req.params.userName);
    const response = await FollowCollection.getFollowing(user._id);
    res.status(200).json({response});
  }
);

/**
 * Get freets for the accounts being followed by a user
 *
 * @name GET /api/follow/followfreets/:userName
 *
 * @return {string} - The following list for the user
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the user does not exist
 */
router.get(
  '/followfreets/:userName?',
  [
    userValidator.isUserLoggedIn,
    followValidator.isUserExists
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOneByUsername(req.params.userName);
    const following = await FollowCollection.getFollowing(user._id);
    const promises = [];
    for (const account of following) {
      promises.push(FreetCollection.findAllByUsername(account));
    }

    // Flatten and return array
    const responses = await Promise.all(promises);
    const result = responses.reduce((accumulator, value) => accumulator.concat(value), []);
    const response = result.map(util.constructFreetResponse);
    res.status(200).json({response});
  }
);

/**
 * Follow a user
 *
 * @name PUT /api/follow/followuser/:userName
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the user does not exist
 */
router.put(
  '/followuser/:userName?',
  [
    userValidator.isUserLoggedIn,
    followValidator.isUserExists,
    followValidator.canFollow
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOneByUserId(req.session.userId);
    const user2 = await UserCollection.findOneByUsername(req.params.userName);
    await FollowCollection.addFollower(user2._id, user._id);
    res.status(200).json({
      message: `${user.username} followed ${req.params.userName} successfully`
    });
  }
);

/**
 * Unfollow a user
 *
 * @name Delete /api/follow/followuser/:userName
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the user does not exist
 */
router.delete(
  '/followuser/:userName?',
  [
    userValidator.isUserLoggedIn,
    followValidator.isUserExists,
    followValidator.canUnfollow
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOneByUserId(req.session.userId);
    const user2 = await UserCollection.findOneByUsername(req.params.userName);
    await FollowCollection.removeFollower(user2._id, user._id);
    res.status(200).json({
      message: `${user.username} unfollowed ${req.params.userName} successfully`
    });
  }
);

/**
 * Hide the followers for a user
 *
 * @name Put /api/follow/hidefollow/:userName
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in, or is not the current user modifying settings
 * @throws {404} - If the user does not exist
 */
router.put(
  '/hidefollow/:userName?',
  [
    userValidator.isUserLoggedIn,
    followValidator.isValidUserModifier
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOneByUsername(req.params.userName);
    const id = user._id;
    await FollowCollection.updateFollowPrivacy(id, true);
    const followobj = await FollowCollection.findOne(id);
    const privateStatus = followobj.isHidden ? 'Hidden' : 'Public';
    res.status(200).json({
      message: `You have hidden your followers. The current status is ${privateStatus}`
    });
  }
);

/**
 * Unhide the followers for a user
 *
 * @name Put /api/follow/unhidefollow/:userName
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in, or is not the current user modifying settings
 * @throws {404} - If the user does not exist
 */
router.put(
  '/unhidefollow/:userName?',
  [
    userValidator.isUserLoggedIn,
    followValidator.isValidUserModifier
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOneByUsername(req.params.userName);
    const id = user._id;
    await FollowCollection.updateFollowPrivacy(id, false);
    const followobj = await FollowCollection.findOne(id);
    const privateStatus = followobj.isHidden ? 'Hidden' : 'Public';
    res.status(200).json({
      message: `You have unhidden your followers. The current status is ${privateStatus}`
    });
  }
);

export {router as followRouter};

// /**
//  * Get followers for a user
//  *
//  * @name GET /api/users/follows/:userName
//  *
//  * @return {string} - The followers for the user
//  * @throws {403} - If the user is not logged in
//  * @throws {404} - If the freetId is not valid
//  */
// router.get(
//   '/follows/:userName?',
//   [
//     userValidator.isUserLoggedIn,
//     followValidator.isUserExists
//   ],
//   async (req: Request, res: Response) => {
//     const response = await FollowCollection.getFollows(req.params.userName);
//     res.status(200).json({response});
//   }
// );

// /**
//  * Get accounts being followed by a user
//  *
//  * @name GET /api/users/following/:userName
//  *
//  * @return {string} - The following list for the user
//  * @throws {403} - If the user is not logged in
//  * @throws {404} - If the freetId is not valid
//  */
// router.get(
//   '/following/:userName?',
//   [
//     userValidator.isUserLoggedIn,
//     followValidator.isUserExists
//   ],
//   async (req: Request, res: Response) => {
//     const user = await UserCollection.findOneByUsername(req.params.userName);
//     const response = await FollowCollection.getFollowing(user._id);
//     res.status(200).json({response});
//   }
// );

// /**
//  * Follow a user
//  *
//  * @name PUT /api/users/follow/:user1name/:user2name
//  *
//  * @return {string} - A success message
//  * @throws {403} - If the user is not logged in
//  * @throws {404} - If the freetId is not valid
//  */
// router.put(
//   '/follow/:user1Name?/:user2Name?',
//   [
//     userValidator.isUserLoggedIn
//   ],
//   async (req: Request, res: Response) => {
//     const user = await UserCollection.findOneByUsername(req.params.user1Name);
//     const user2 = await UserCollection.findOneByUsername(req.params.user2Name);
//     await FollowCollection.addFollower(user._id, user2._id);
//     res.status(200).json({
//       message: `${req.params.user2Name} followed ${req.params.user1Name} successfully`
//     });
//   }
// );

// /**
//  * Unfollow a user
//  *
//  * @name Delete /api/users/follow/:user1name/:user2name
//  *
//  * @return {string} - A success message
//  * @throws {403} - If the user is not logged in
//  * @throws {404} - If the freetId is not valid
//  */
// router.delete(
//   '/follow/:user1Name?/:user2Name?',
//   [
//     userValidator.isUserLoggedIn
//   ],
//   async (req: Request, res: Response) => {
//     const user = await UserCollection.findOneByUsername(req.params.user1Name);
//     const user2 = await UserCollection.findOneByUsername(req.params.user2Name);
//     await FollowCollection.removeFollower(user._id, user2._id);
//     res.status(200).json({
//       message: `${req.params.user2Name} unfollowed ${req.params.user1Name} successfully`
//     });
//   }
// );

// /**
//  * Hide the followers for a user
//  *
//  * @name Put /api/users/hidefollow/:userName
//  *
//  * @return {string} - A success message
//  * @throws {403} - If the user is not logged in
//  * @throws {404} - If the freetId is not valid
//  */
// router.put(
//   '/hidefollow/:userName?',
//   [
//     userValidator.isUserLoggedIn,
//     followValidator.isValidUserModifier
//   ],
//   async (req: Request, res: Response) => {
//     const user = await UserCollection.findOneByUsername(req.params.userName);
//     const id = user._id;
//     await FollowCollection.updateFollowPrivacy(id, true);
//     const followobj = await FollowCollection.findOne(id);
//     const privateStatus = followobj.isHidden ? 'Hidden' : 'Public';
//     res.status(200).json({
//       message: `You have hidden your followers. The current status is ${privateStatus}`
//     });
//   }
// );

// /**
//  * Unhide the followers for a user
//  *
//  * @name Put /api/users/unhidefollow/:userName
//  *
//  * @return {string} - A success message
//  * @throws {403} - If the user is not logged in
//  * @throws {404} - If the freetId is not valid
//  */
// router.put(
//   '/unhidefollow/:userName?',
//   [
//     userValidator.isUserLoggedIn,
//     followValidator.isValidUserModifier
//   ],
//   async (req: Request, res: Response) => {
//     const user = await UserCollection.findOneByUsername(req.params.userName);
//     const id = user._id;
//     await FollowCollection.updateFollowPrivacy(id, false);
//     const followobj = await FollowCollection.findOne(id);
//     const privateStatus = followobj.isHidden ? 'Hidden' : 'Public';
//     res.status(200).json({
//       message: `You have unhidden your followers. The current status is ${privateStatus}`
//     });
//   }
// );

// export {router as likeRouter};
