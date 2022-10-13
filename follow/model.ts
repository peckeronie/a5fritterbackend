import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';

/**
 * This file defines the properties stored in a Freet
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Follow on the backend
export type Follow = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  userID: User;
  followers: Types.Array<string>;
  following: Types.Array<string>;
  isHidden: boolean;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const FollowSchema = new Schema<Follow>({
  userID: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  followers: {
    type: [String],
    required: true
  },
  following: {
    type: [String],
    required: true
  },
  isHidden: {
    type: Boolean,
    required: true
  }
});

const FollowModel = model<Follow>('Follow', FollowSchema);
export default FollowModel;
