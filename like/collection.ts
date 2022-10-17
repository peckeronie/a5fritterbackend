import type {HydratedDocument, Types} from 'mongoose';
import type {Like} from './model';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';
import FreetModel from '../freet/model';
import LikeModel from './model';
import UserModel from 'user/model';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class LikeCollection {
  /**
   * Initialize a Like data model
   *
   * @param {string} freetId - The id of the freet
   * @return {Promise<HydratedDocument<Like>>} - The newly created like object
   */
  static async addOne(freetID: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
    const freetLikes = new LikeModel({
      freetID,
      likes: 0,
      hiddenLikes: false,
      likers: []
    });
    await freetLikes.save();
    return freetLikes;
  }

  /**
   * Find a Like object by freetId
   *
   * @param {string} freetId - The id of the freet to find
   * @return {Promise<HydratedDocument<Like>> | Promise<null> } - The Like object with the given freetId, if any
   */
  static async findOne(freetId: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
    return LikeModel.findOne({freetID: freetId});
  }

  /**
   * Delete the Like object for a freet with given freetId.
   *
   * @param {string} freetId - The freetId of the freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(freetId: Types.ObjectId | string): Promise<boolean> {
    const freetLike = await LikeModel.deleteOne({freetID: freetId});
    return freetLike !== null;
  }

  /**
   * Update a freet by adding or subtracting a like
   *
   * @param {string} freetId - The id of the freet to be updated
   * @param {number} newLike - The new like or unlike to the freet
   * @param {string} userId - the id of the user who likes or unlikes the freet
   * @return {Promise<HydratedDocument<Like>>} - The newly updated Like object for the freet
   */
  static async updateLikes(freetId: Types.ObjectId | string, newLike: number, userId: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
    const freet = await LikeModel.findOne({freetID: freetId});
    const user = await UserCollection.findOneByUserId(userId);
    freet.likes += newLike;
    if (newLike === 1) {
      freet.likers.push(user.username);
    } else {
      const index = freet.likers.indexOf(user.username);
      if (index !== -1) {
        freet.likers.splice(index, 1);
      }
    }

    await freet.save();
    return freet;
  }

  /**
   * Update the freet to hide or unhide its likes
   *
   * @param {string} freetId - The id of the freet to be updated
   * @param {boolean} newPrivacy - Whether to hide or unhide the likes
   * @return {Promise<HydratedDocument<Like>>} - The newly updated Like object for the freet
   */
  static async updateLikePrivacy(freetId: Types.ObjectId | string, newPrivacy: boolean): Promise<HydratedDocument<Like>> {
    const freet = await LikeModel.findOne({freetID: freetId});
    freet.hiddenLikes = newPrivacy;
    await freet.save();
    return freet;
  }
}

export default LikeCollection;
