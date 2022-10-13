import type {HydratedDocument, Types} from 'mongoose';
import type {Like} from './model';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';
import FreetModel from '../freet/model';
import LikeModel from './model';

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
   * @param {string} content - The id of the content of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly created freet
   */
  static async addOne(freetID: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
    const freetLikes = new LikeModel({
      freetID,
      likes: 0,
      hiddenLikes: false
    });
    await freetLikes.save(); // Saves freet to MongoDB
    return freetLikes;
  }

  /**
   * Find a freet by freetId
   *
   * @param {string} freetId - The id of the freet to find
   * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The freet with the given freetId, if any
   */
  static async findOne(freetId: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
    return LikeModel.findOne({freetID: freetId});
  }

  /**
   * Delete the Like object for a freet with given freetId.
   *
   * @param {string} freetId - The freetId of freet to delete
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
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
  static async updateLikes(freetId: Types.ObjectId | string, newLike: number): Promise<HydratedDocument<Like>> {
    const freet = await LikeModel.findOne({freetID: freetId});
    freet.likes += newLike;
    await freet.save();
    return freet;
  }

  /**
   * Update the freet to hide or unhide its likes
   *
   * @param {string} freetId - The id of the freet to be updated
   * @param {boolean} newPrivacy - Whether to hide or unhide the likes
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
  static async updateLikePrivacy(freetId: Types.ObjectId | string, newPrivacy: boolean): Promise<HydratedDocument<Like>> {
    const freet = await LikeModel.findOne({freetID: freetId});
    freet.hiddenLikes = newPrivacy;
    await freet.save();
    return freet;
  }
}

export default LikeCollection;
