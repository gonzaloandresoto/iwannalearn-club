import { Schema, models, model } from 'mongoose';

export interface IElement extends Document {
  _id: string;
  type: string;
  title: string;
  content: string;
  question: string;
  options: Array<string>;
  answer: string;
  status: boolean;
  unitId: { _id: string };
}

const ElementSchema = new Schema({
  type: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  question: { type: String, required: true },
  options: { type: Array, required: true },
  answer: { type: String, required: true },
  status: { type: Boolean, required: true },
  unitId: { type: Schema.Types.ObjectId, ref: 'Unit' },
});

const Element = models.Element || model('Element', ElementSchema);

export default Element;
