import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';

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

// /**
//  * Checks if a user with userId as author id in req.query exists
//  */
// const isUserExists = async (req: Request, res: Response, next: NextFunction) => {
//   const user = await UserCollection.findOneByUserId(req.params.userId);
//   if (!user) {
//     res.status(404).json({
//       error: `A user with id ${req.params.userId} does not exist.`
//     });
//     return;
//   }

//   next();
// };

// /**
//  * Checks if the current user is the author of the freet whose freetId is in req.params
//  */
// const isValidUserModifier = async (req: Request, res: Response, next: NextFunction) => {
//   if (req.session.userId !== req.params.userId.toString()) {
//     res.status(403).json({
//       error: 'Cannot modify other users\' freets.'
//     });
//     return;
//   }

//   next();
// };

export {
  isUserExists,
  isValidUserModifier
};
