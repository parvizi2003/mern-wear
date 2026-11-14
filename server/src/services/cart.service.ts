import mongoose, { Types } from "mongoose";
import { Cart, CartItem } from "../models/cart.model.js";
import {
  Product,
  ProductVariant,
  IProductVariant,
} from "../models/product.model.js";

import type { CartDocument } from "../models/cart.model.js";
import type {
  CartDto,
  CartItemDto,
  AddToCartResponseDto,
  UpdateCartItemResponseDto,
  PopulatedProduct,
  PopulatedVariant,
} from "../dtos/cart.dto.js";
import type { AddToCartInput } from "../schemas/cart.schema.js";

import { AppError } from "../utils/app-error.js";

interface PopulatedCartItem {
  _id: Types.ObjectId;
  product: PopulatedProduct;
  variant: PopulatedVariant;
  size: string;
  quantity: number;
  price: number;
}

const mapCartItem = (item: PopulatedCartItem): CartItemDto => ({
  id: item._id.toString(),
  productId: item.product._id.toString(),
  productSlug: item.product.slug,
  productName: item.product.name,
  image: item.variant.image,
  variantId: item.variant._id.toString(),
  color: item.variant.color,
  size: item.size,
  quantity: item.quantity,
  price: item.price,
  subtotal: item.price * item.quantity,
});

export const recalculateCart = async (
  cart: CartDocument,
  session?: mongoose.ClientSession,
) => {
  const cartItems = await CartItem.find({ cart: cart._id }).session(
    session ?? null,
  );

  cart.itemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  cart.total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  await cart.save({ session });
};

export const updateCartTotals = async (
  cart: CartDocument,
  price: number,
  action: "add" | "remove",
  quantity = 1,
) => {
  const multiplier = action === "add" ? 1 : -1;

  cart.itemsCount += multiplier * quantity;
  cart.total += price * multiplier * quantity;

  await cart.save();
};

export const mergeCarts = async (sessionId: string, userId: string) => {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const sessionCart = await Cart.findOne({ sessionId }).session(session);

      if (!sessionCart) return;

      const userCart = await Cart.findOne({ user: userId }).session(session);

      if (!userCart) {
        sessionCart.user = new Types.ObjectId(userId);
        sessionCart.sessionId = null;

        await sessionCart.save({ session });
        return;
      }

      const guestItems = await CartItem.find({
        cart: sessionCart._id,
      }).session(session);

      for (const guestItem of guestItems) {
        const existingItem = await CartItem.findOne({
          cart: userCart._id,
          variant: guestItem.variant,
          size: guestItem.size,
        }).session(session);

        if (existingItem) {
          existingItem.quantity += guestItem.quantity;
          await existingItem.save({ session });
          await guestItem.deleteOne({ session });
        } else {
          guestItem.cart = userCart._id;
          await guestItem.save({ session });
        }
      }

      await sessionCart.deleteOne({ session });

      await recalculateCart(userCart, session);
    });
  } finally {
    await session.endSession();
  }
};

const checkStock = async (
  variant: IProductVariant,
  size: string,
  quantity: number,
) => {
  const sizeData = variant.sizes.find((item) => item.size === size);

  if (!sizeData || quantity > sizeData.stock) {
    throw new AppError("Not enough stock", 400);
  }

  return sizeData;
};

export const getCart = async (
  userId?: string,
  sessionId?: string,
): Promise<CartDto> => {
  if (!userId && !sessionId) {
    throw new AppError("Either userId or sessionId is required", 400);
  }

  const filter = userId ? { user: userId } : { sessionId };

  const cart = await Cart.findOne(filter).populate<{
    items: PopulatedCartItem[];
  }>({
    path: "items",
    populate: [
      { path: "product", select: "name slug" },
      { path: "variant", select: "color image" },
    ],
  });

  if (!cart) {
    return { items: [], itemsCount: 0, total: 0 };
  }

  return {
    items: cart.items.map(mapCartItem),
    itemsCount: cart.itemsCount,
    total: cart.total,
  };
};

export const addToCart = async (
  cart: CartDocument,
  { productId, variantId, size }: AddToCartInput,
): Promise<AddToCartResponseDto> => {
  const [product, variant] = await Promise.all([
    Product.findById(productId),
    ProductVariant.findOne({
      _id: variantId,
      product: productId,
    }),
  ]);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  if (!variant) {
    throw new AppError("Product variant not found", 404);
  }

  const sizeData = variant.sizes.find((item) => item.size === size);

  if (!sizeData || sizeData.stock < 1) {
    throw new AppError("Selected size is not available", 400);
  }

  const existingItem = await CartItem.findOne({
    cart: cart._id,
    variant: variant._id,
    size,
  });

  const newQuantity = (existingItem?.quantity ?? 0) + 1;

  if (newQuantity > sizeData.stock) {
    throw new AppError("Not enough stock", 400);
  }

  let cartItem;

  if (existingItem) {
    existingItem.quantity = newQuantity;
    cartItem = await existingItem.save();
  } else {
    cartItem = await CartItem.create({
      cart: cart._id,
      product: product._id,
      variant: variant._id,
      size,
      quantity: 1,
      price: product.price,
    });
  }

  await updateCartTotals(cart, product.price, "add");

  const populatedItem: CartItemDto = {
    id: cartItem._id.toString(),
    productId: product._id.toString(),
    productSlug: product.slug,
    productName: product.name,
    image: variant.image,
    variantId: variant._id.toString(),
    color: variant.color,
    size: sizeData.size,
    quantity: cartItem.quantity,
    price: cartItem.price,
    subtotal: cartItem.price * cartItem.quantity,
  };

  return {
    item: populatedItem,
    itemsCount: cart.itemsCount,
    total: cart.total,
  };
};

export const updateCartItem = async (
  cart: CartDocument,
  itemId: string,
  { action }: { action: "add" | "remove" },
): Promise<UpdateCartItemResponseDto> => {
  const cartItem = await CartItem.findOne({
    _id: itemId,
    cart: cart._id,
  }).populate<{ variant: IProductVariant }>("variant", "sizes");

  if (!cartItem) {
    throw new AppError("Cart item not found", 404);
  }

  const quantityChange = action === "add" ? 1 : -1;
  const newQuantity = cartItem.quantity + quantityChange;

  if (action === "add") {
    if (!cartItem.variant) {
      throw new AppError("Product variant not found", 404);
    }

    await checkStock(cartItem.variant, cartItem.size, newQuantity);
  }

  if (newQuantity === 0) {
    await CartItem.deleteOne({ _id: cartItem._id, cart: cart._id });
  } else {
    await CartItem.updateOne(
      { _id: cartItem._id, cart: cart._id },
      { $set: { quantity: newQuantity } },
    );
  }

  await updateCartTotals(cart, cartItem.price, action);

  return {
    item: {
      id: cartItem._id.toString(),
      quantity: Math.max(newQuantity, 0),
    },
    itemsCount: cart.itemsCount,
    total: cart.total,
  };
};

export const deleteCartItem = async (cart: CartDocument, itemId: string) => {
  const cartItem = await CartItem.findOneAndDelete({
    _id: itemId,
    cart: cart._id,
  });

  if (!cartItem) {
    throw new AppError("Cart item not found", 404);
  }

  await updateCartTotals(cart, cartItem.price, "remove", cartItem.quantity);

  return {
    item: {
      id: cartItem._id.toString(),
      quantity: 0,
    },
    itemsCount: cart.itemsCount,
    total: cart.total,
  };
};
