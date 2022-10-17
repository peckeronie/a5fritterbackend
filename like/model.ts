import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';

/**
 * This file defines the properties stored in a Like concept
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Like on the backend
export type Like = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  freetID: Freet;
  likes: number;
  hiddenLikes: boolean;
  likers: Types.Array<string>;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const LikeSchema = new Schema<Like>({
  freetID: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  },
  likes: {
    type: Number,
    required: true
  },
  hiddenLikes: {
    type: Boolean,
    required: true
  },
  likers: {
    type: [String],
    required: true
  }
});

const LikeModel = model<Like>('Like', LikeSchema);
export default LikeModel;
