import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';

/**
 * This file defines the properties stored in a Freet
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Freet on the backend
export type Source = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  freetID: Freet;
  sources: Types.Array<string>;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const SourceSchema = new Schema<Source>({
  // The author userId
  freetID: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  },
  sources: {
    type: [String],
    required: true
  }
});

const SourceModel = model<Source>('Source', SourceSchema);
export default SourceModel;
