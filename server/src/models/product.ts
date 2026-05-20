import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    variants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductVariant",
      },
    ],

    price: { type: Number, required: true },
  },
  { timestamps: true },
);

export const Product = mongoose.model("Product", productSchema);

const productVariantSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    color: {
      name: {
        type: String,
        required: true,
      },
      code: {
        type: String,
        required: true,
      },
    },

    image: {
      type: String,
      required: true,
    },

    sizes: [
      {
        size: {
          type: String,
          required: true,
        },
        stock: {
          type: Number,
          default: 0,
        },
      },
    ],

    skuPrefix: {
      type: String,
    },
  },
  { timestamps: true },
);

productVariantSchema.index({ product: 1, size: 1, color: 1 }, { unique: true });

export const ProductVariant = mongoose.model(
  "ProductVariant",
  productVariantSchema,
);
