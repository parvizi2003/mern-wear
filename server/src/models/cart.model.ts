import mongoose, { type HydratedDocument, type Types } from "mongoose";

export interface ICartItem {
  cart: Types.ObjectId;
  product: Types.ObjectId;
  variant: Types.ObjectId;
  size: string;
  quantity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICart {
  id: Types.ObjectId;
  user: Types.ObjectId | null;
  sessionId: string | null;
  itemsCount: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export type CartDocument = HydratedDocument<ICart>;
export type CartItemDocument = HydratedDocument<ICartItem>;

const cartItemSchema = new mongoose.Schema<ICartItem>(
  {
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
      index: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    variant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
      required: true,
    },
    size: {
      type: String,
      required: true,
      uppercase: true,
      enum: ["XS", "S", "M", "L", "XL", "XXL"],
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true },
);

cartItemSchema.index({ cart: 1, variant: 1, size: 1 }, { unique: true });

const cartSchema = new mongoose.Schema<ICart>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    sessionId: {
      type: String,
      default: null,
    },
    itemsCount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

cartSchema.index(
  { user: 1 },
  {
    unique: true,
    partialFilterExpression: { user: { $type: "objectId" } },
  },
);

cartSchema.index(
  { sessionId: 1 },
  {
    unique: true,
    partialFilterExpression: { sessionId: { $type: "string" } },
  },
);

cartSchema.virtual("items", {
  ref: "CartItem",
  localField: "_id",
  foreignField: "cart",
});

export const Cart = mongoose.model<ICart>("Cart", cartSchema);
export const CartItem = mongoose.model<ICartItem>("CartItem", cartItemSchema);
