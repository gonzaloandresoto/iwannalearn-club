import { Schema, models, model } from 'mongoose';

const ElementSchema = new Schema(
  {
    type: { type: String, required: true },
    order: { type: Number, required: true },
    title: { type: String, required: true },
    content: { type: String, required: false },
    links: { type: String, required: false },
    unitId: { type: Schema.Types.ObjectId, ref: 'Unit' },
  },
  { timestamps: true }
);

const Element = models.Element || model('Element', ElementSchema);

export default Element;
