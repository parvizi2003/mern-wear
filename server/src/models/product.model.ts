import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema(
  {
    size: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      enum: ["XS", "S", "M", "L", "XL", "XXL"],
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    _id: false,
  },
);

const productVariantSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    color: {
      name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },

      code: {
        type: String,
        required: true,
        trim: true,
      },
    },

    image: {
      type: String,
      required: true,
      trim: true,
    },

    sizes: {
      type: [sizeSchema],
      validate: {
        validator: function (sizes: { size: string; stock: number }[]) {
          const uniqueSizes = new Set(sizes.map((s) => s.size.toUpperCase()));

          return uniqueSizes.size === sizes.length;
        },

        message: "Duplicate sizes are not allowed",
      },
    },
  },
  {
    timestamps: true,
  },
);

productVariantSchema.index(
  {
    product: 1,
    "color.name": 1,
  },
  {
    unique: true,
  },
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,

    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

productSchema.virtual("variants", {
  ref: "ProductVariant",
  localField: "_id",
  foreignField: "product",
});

export const Product = mongoose.model("Product", productSchema);

export const ProductVariant = mongoose.model(
  "ProductVariant",
  productVariantSchema,
);
