import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Freet, PopulatedFreet} from '../freet/model';
import type {Like} from '../like/model';

// Update this if you add a property to the Freet type!
type LikeResponse = {
  _id: string;
  freetID: string;
  likes: number;
  hiddenLikes: boolean;
};

// /**
//  * Transform a raw Freet object from the database into an object
//  * with all the information needed by the frontend
//  *
//  * @param {HydratedDocument<Like>} freetLike - A freet
//  * @returns {FreetResponse} - The freet object formatted for the frontend
//  */
// const constructLikeResponse = (freetLike: HydratedDocument<Like>): LikeResponse => {
//   const freetLikeCopy: Like = {
//     ...freetLike.toObject({
//       versionKey: false // Cosmetics; prevents returning of __v property
//     })
//   };
//   return {
//     ...freetLikeCopy
//   };
// };

// export {
//   constructLikeResponse
// };
