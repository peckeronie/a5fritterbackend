import type {HydratedDocument, Types} from 'mongoose';
import type {Follow} from './model';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';
import FreetModel from '../freet/model';
import FollowModel from './model';
import UserModel from 'user/model';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class FollowCollection {
  /**
   * Initialize a Follow data model
   *
   * @return {Promise<HydratedDocument<Freet>>} - The newly created freet
   */
  static async addOne(authorId: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
    const follow = new FollowModel({
      userID: authorId,
      followers: [],
      following: [],
      isHidden: false
    });
    await follow.save(); // Saves freet to MongoDB
    return follow;
  }

  /**
   * Find a Follow object by userId.
   *
   * @param {string} userId - The userId of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
   */
  static async findOne(userId: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
    return FollowModel.findOne({userID: userId});
  }

  /**
   * Get followers
   *
   * @param {string} userId - The id of the user
   * @return {Promise<Array<string>>} - The followers of the user
   */
  static async getFollows(userId: Types.ObjectId | string): Promise<string[]> {
    const followObj = await FollowModel.findOne({userID: userId});
    return followObj.followers;
  }

  /**
   * Get following list
   *
   * @param {string} userId - The id of the user
   * @return {Promise<Array<string>>} - Who the user is following
   */
  static async getFollowing(userId: Types.ObjectId | string): Promise<string[]> {
    const followObj = await FollowModel.findOne({userID: userId});
    return followObj.following;
  }

  /**
   * Add a follower (with followerID following userID)
   *
   * @param {string} userId - The user being followed
   * @param {string} followerID - The user following an account
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
  static async addFollower(userId: Types.ObjectId | string, followerID: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
    const followObj = await FollowModel.findOne({userID: userId});
    const follow2 = await FollowModel.findOne({userID: followerID});
    const user1 = await UserCollection.findOneByUserId(userId);
    const user2 = await UserCollection.findOneByUserId(followerID);
    followObj.followers.push(user2.username);
    follow2.following.push(user1.username);
    await followObj.save();
    await follow2.save();
    return followObj;
  }

  /**
   * Unfollow / remove a follower
   *
   * @param {string} userId - The user being unfollowed
   * @param {string} followerID - The user who is unfollowing
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
  static async removeFollower(userId: Types.ObjectId | string, followerID: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
    const followObj = await FollowModel.findOne({userID: userId});
    const follow2 = await FollowModel.findOne({userID: followerID});
    const user1 = await UserCollection.findOneByUserId(userId);
    const user2 = await UserCollection.findOneByUserId(followerID);
    const index = followObj.followers.indexOf(user2.username);
    const index2 = follow2.following.indexOf(user1.username);
    if (index !== -1) {
      followObj.followers.splice(index, 1);
    }

    if (index2 !== -1) {
      follow2.following.splice(index2, 1);
    }

    await followObj.save();
    await follow2.save();
    return followObj;
  }

  /**
   * Update a user's info to hide or unhide their followers
   *
   * @param {string} userId - The id of the user
   * @param {boolean} newPrivacy - Whether to hide or unhide the likes
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
  static async updateFollowPrivacy(userId: Types.ObjectId | string, newPrivacy: boolean): Promise<HydratedDocument<Follow>> {
    const follow = await FollowModel.findOne({userID: userId});
    follow.isHidden = newPrivacy;
    await follow.save();
    return follow;
  }

  /**
   * Delete a Follow object
   *
   * @param {string} userId - The id of the user
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(userId: Types.ObjectId | string): Promise<boolean> {
    const follow = await FollowModel.deleteOne({userID: userId});
    return follow !== null;
  }
}

export default FollowCollection;
