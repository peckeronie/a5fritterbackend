import type {HydratedDocument, Types} from 'mongoose';
import type {Source} from './model';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';
import FreetModel from '../freet/model';
import LikeModel from '../like/model';
import SourceModel from './model';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class SourceCollection {
  /**
   * Initialize a Source data model
   *
   * @param {string} freetId - The id of the freet
   * @param {string} content - The id of the content of the freet
   * @return {Promise<HydratedDocument<Source>>} - The newly created freet
   */
  static async addOne(freetID: Types.ObjectId | string): Promise<HydratedDocument<Source>> {
    const freetSources = new SourceModel({
      freetID,
      sources: []
    });
    await freetSources.save(); // Saves freet to MongoDB
    return freetSources;
  }

  /**
   * Find a freet by freetId
   *
   * @param {string} freetId - The id of the freet to find
   * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The freet with the given freetId, if any
   */
  static async findOne(freetId: Types.ObjectId | string): Promise<HydratedDocument<Source>> {
    return SourceModel.findOne({freetID: freetId});
  }

  /**
   * Delete the Source object for a freet with given freetId.
   *
   * @param {string} freetId - The freetId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(freetId: Types.ObjectId | string): Promise<boolean> {
    const freetSource = await SourceModel.deleteOne({freetID: freetId});
    return freetSource !== null;
  }

  /**
   * Find all sources for a freet given by freetId
   *
   * @param {string} freetId - The id of the freet to find
   * @return {Promise<HydratedDocument<Source>> | Promise<null> } - The freet with the given freetId, if any
   */
  static async findSourcesByFreet(freetId: Types.ObjectId | string): Promise<string[]> {
    const freet = await SourceModel.findOne({freetID: freetId});
    return freet.sources;
  }

  /**
   * Add a source to a freet
   *
   * @param {string} freetId - The id of the freet to be updated
   * @param {number} newSource - The new source
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
  static async addSource(freetId: Types.ObjectId | string, newSource: string): Promise<HydratedDocument<Source>> {
    const freetSources = await SourceModel.findOne({freetID: freetId});
    freetSources.sources.push(newSource);
    await freetSources.save();
    return freetSources;
  }

  /**
   * Remove a source from a freet
   *
   * @param {string} freetId - The id of the freet to be updated
   * @param {number} removedSource - The source to be removed
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
  static async removeSource(freetId: Types.ObjectId | string, removedSource: string): Promise<HydratedDocument<Source>> {
    const freetSources = await SourceModel.findOne({freetID: freetId});
    const sourceArr = freetSources.sources;
    const sourceIndex = sourceArr.indexOf(removedSource);
    if (sourceIndex !== -1) {
      sourceArr.splice(sourceIndex, 1);
    }

    await freetSources.save();
    return freetSources;
  }
}

export default SourceCollection;
