import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import SourceCollection from '../source/collection';
import SourceModel from './model';

function isValidUrl(str: string) {
  let url;
  try {
    url = new URL(str);
  } catch (_: unknown) {
    return false;
  }

  return true;

  // eslint-disable-next-line capitalized-comments
  // return url.protocol === 'http:' || url.protocol === 'https:';
}

/**
 * Checks if a source is a valid website url
 */
const isValidSource = (req: Request, res: Response, next: NextFunction) => {
  if (!isValidUrl(req.body.source)) {
    res.status(400).json({
      error: {
        username: 'Source must be a valid link or url.'
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a source exists in the sources for a freet
 */
const sourceExists = async (req: Request, res: Response, next: NextFunction) => {
  const freetSources = await SourceModel.findOne({freetID: req.params.freetId});
  if (!freetSources.sources.includes(req.body.source)) {
    res.status(400).json({
      error: {
        username: 'Cannot remove a source that was not originally added.'
      }
    });
    return;
  }

  next();
};

// /**
//  * Checks if a source is a valid website url
//  */
// const isValidSource = (req: Request, res: Response, next: NextFunction) => {
//   const sourceRegex = /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-/]))?/;
//   if (!sourceRegex.test(req.params.source)) {
//     res.status(400).json({
//       error: {
//         username: 'Source must be a valid link or url.'
//       }
//     });
//     return;
//   }

//   next();
// };

export {
  isValidSource,
  sourceExists
};
