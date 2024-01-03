import { Schema, models, model } from 'mongoose';

export interface IElement extends Document {
  _id: string;
  type: string;
  order: string;
  title: string;
  content?: string;
  unitId?: { _id: string };
}

const ElementSchema = new Schema(
  {
    type: { type: String, required: true },
    order: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    unitId: { type: Schema.Types.ObjectId, ref: 'Unit' },
  },
  { timestamps: true }
);

const Element = models.Element || model('Element', ElementSchema);

export default Element;
