import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';
import FollowCollection from '../follow/collection';

/**
 * Checks if a user with the username in 'userID' exists
 */
const isUserExists = async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserCollection.findOneByUsername(req.params.userName);
  if (!user) {
    res.status(404).json({
      error: `A user with name ${req.params.userId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the owner of the account being modified
 */
const isValidUserModifier = async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserCollection.findOneByUsername(req.params.userName);
  if (req.session.userId !== user._id.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' follower privacy settings.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user can follow a user
 */
const canFollow = async (req: Request, res: Response, next: NextFunction) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const user = await UserCollection.findOneByUserId(req.session.userId);
  const user2 = await UserCollection.findOneByUsername(req.params.userName);
  const followObj = await FollowCollection.findOne(user._id);
  if (followObj.following.includes(user2.username)) {
    res.status(401).json({
      error: 'Already following the user'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user has already followed a user and can unfollow them
 */
const canUnfollow = async (req: Request, res: Response, next: NextFunction) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const user = await UserCollection.findOneByUserId(req.session.userId);
  const user2 = await UserCollection.findOneByUsername(req.params.userName);
  const followObj = await FollowCollection.findOne(user._id);
  if (!followObj.following.includes(user2.username)) {
    res.status(401).json({
      error: 'Cannot unfollow a user that you are currently not following'
    });
    return;
  }

  next();
};

export {
  isUserExists,
  isValidUserModifier,
  canFollow,
  canUnfollow
};
