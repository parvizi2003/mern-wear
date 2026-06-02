import type { Request, Response } from "express";
import { CartItem } from "../models/cart";
import { getCartFromRequest } from "../services/cart/get-cart-from-request";
import { Product, ProductVariant } from "../models/product";
import { recalculateCart } from "../services/cart/recalculate-cart";
import { cartItemSchema } from "../validators/cart-validator";
import { cartDto } from "../dtos/cart-dto";

export const getCart = async (req: Request, res: Response) => {
  try {
    const cart = await getCartFromRequest(req);
    await cart.populate("items");

    return res.json(cartDto(cart));
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

export const addItemToCart = async (req: Request, res: Response) => {
  try {
    const result = cartItemSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const { productId, variantId, size } = result.data;

    const cart = await getCartFromRequest(req);

    let item = await CartItem.findOne({
      cart: cart._id,
      product: productId,
      variant: variantId,
      size: size,
    });

    if (item) {
      item.quantity = item.quantity + 1;
      await item.save();
    } else {
      const product = await Product.findById(productId);
      const variant = await ProductVariant.findById(variantId);
      if (!product || !variant) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (variant.sizes.find((s) => s.size === size)?.stock === 0) {
        return res.status(400).json({
          message: `${product.name} ${variant.color?.name} ${size} is out of stock`,
        });
      }

      item = await CartItem.create({
        cart: cart._id,
        product: productId,
        productSlug: product.slug,
        variant: variantId,
        size: size,
        price: product.price,
      });
    }

    await recalculateCart(cart);

    return res.json({
      message: "Item added successfully",
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const increaseItemQuantity = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;

    const cart = await getCartFromRequest(req);

    const item = await CartItem.findOne({
      _id: itemId,
      cart: cart._id,
    });

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    item.quantity += 1;
    await item.save();

    await recalculateCart(cart);

    return res.json({
      message: "Item quantity increased successfully",
    });
  } catch {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const decreaseItemQuantity = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;

    const cart = await getCartFromRequest(req);

    const item = await CartItem.findOne({
      _id: itemId,
      cart: cart._id,
    });

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    if (item.quantity > 1) {
      item.quantity -= 1;
      await item.save();
    } else {
      await item.deleteOne();
    }

    await recalculateCart(cart);

    return res.json({
      message: "Item quantity decreased successfully",
    });
  } catch {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const deleteCartItem = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;

    const cart = await getCartFromRequest(req);

    const result = await CartItem.deleteOne({
      _id: itemId,
      cart: cart._id,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    await recalculateCart(cart);

    return res.json({
      message: "Item removed successfully",
    });
  } catch {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const cart = await getCartFromRequest(req);
    await CartItem.deleteMany({ cart: cart._id });

    await recalculateCart(cart);
    return res.json({ message: "Cart cleared successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
