import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';
import LikeCollection from '../like/collection';

// /**
//  * Checks if a freet with freetId is req.params exists
//  */
// const isFreetExists = async (req: Request, res: Response, next: NextFunction) => {
//   const validFormat = Types.ObjectId.isValid(req.params.freetId);
//   const freet = validFormat ? await FreetCollection.findOne(req.params.freetId) : '';
//   if (!freet) {
//     res.status(404).json({
//       error: {
//         freetNotFound: `Freet with freet ID ${req.params.freetId} does not exist.`
//       }
//     });
//     return;
//   }

//   next();
// };

// /**
//  * Checks if the content of the freet in req.body is valid, i.e not a stream of empty
//  * spaces and not more than 140 characters
//  */
// const isValidFreetContent = (req: Request, res: Response, next: NextFunction) => {
//   const {content} = req.body as {content: string};
//   if (!content.trim()) {
//     res.status(400).json({
//       error: 'Freet content must be at least one character long.'
//     });
//     return;
//   }

//   if (content.length > 140) {
//     res.status(413).json({
//       error: 'Freet content must be no more than 140 characters.'
//     });
//     return;
//   }

//   next();
// };

/**
 * Checks if the current user can unlike the freet with an id of freetId
 */
const canUnlike = async (req: Request, res: Response, next: NextFunction) => {
  const freet = await LikeCollection.findOne(req.params.freetId);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const user = await UserCollection.findOneByUserId(req.session.userId);
  if (!freet.likers.includes(user.username)) {
    res.status(401).json({
      error: 'Cannot unlike a freet that was not previously liked.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user has liked the freet with an id of freetId
 */
const isAlreadyLiked = async (req: Request, res: Response, next: NextFunction) => {
  const freet = await LikeCollection.findOne(req.params.freetId);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const user = await UserCollection.findOneByUserId(req.session.userId);
  if (freet.likers.includes(user.username)) {
    res.status(401).json({
      error: 'Cannot like a freet more than once.'
    });
    return;
  }

  next();
};

export {
  canUnlike,
  isAlreadyLiked
};
