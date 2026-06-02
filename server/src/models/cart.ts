import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
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

    productSlug: {
      type: String,
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
  {
    timestamps: true,
  },
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    sessionId: {
      type: String,
      default: null,
      index: true,
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

cartSchema.virtual("items", {
  ref: "CartItem",
  localField: "_id",
  foreignField: "cart",
});

export const Cart = mongoose.model("Cart", cartSchema);

export const CartItem = mongoose.model("CartItem", cartItemSchema);
