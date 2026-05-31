import { Request, Response } from "express";
import { Order, OrderItem } from "../models/order";
import { AuthRequest } from "../types/auth-request";
import { Cart, CartItem } from "../models/cart";
import type { ProductDoc, ProductVariantDoc } from "../dtos/product-dto";
import { CartRequest } from "../types/cart-request";

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user.id;

    const orders = await Order.find({ user: userId })
      .populate("items")
      .sort({ createdAt: -1 });
    return res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;

    const filter: Record<string, unknown> = {};

    if (
      status &&
      ["pending", "success", "cancelled"].includes(status as string)
    ) {
      filter.status = status;
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    return res.json({ orders });
  } catch {
    return res.status(500).json({
      message: "Server error",
    });
  }
};
export const create = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const cartReq = req as CartRequest;

    const cart = await Cart.findById(cartReq.cart.id);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartItems = await CartItem.find({ cart: cart._id }).populate<{
      product: ProductDoc;
      variant: ProductVariantDoc;
    }>(["product", "variant"]);

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const order = await Order.create({
      user: authReq.user.id,
      userEmail: authReq.user.email,
      itemsCount: cart.itemsCount,
      total: cart.total,
      status: "pending",
    });

    const orderItems: any[] = [];

    for (const item of cartItems) {
      const product = item.product;
      const variant = item.variant;

      const sizeData = variant.sizes.find((s: any) => s.size === item.size);

      if (!sizeData) {
        return res.status(400).json({
          message: `Size not found for ${product.name}`,
        });
      }

      if (sizeData.stock < item.quantity) {
        return res.status(400).json({
          message: `${product.name} (${item.size}) out of stock`,
        });
      }

      sizeData.stock -= item.quantity;
      await variant.save();

      orderItems.push({
        order: order._id,

        product: product._id,
        variant: variant._id,

        productName: product.name,
        color: variant.color.name,

        size: item.size,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.quantity * item.price,
      });
    }

    await OrderItem.insertMany(orderItems);

    await CartItem.deleteMany({ cart: cart._id });

    await Cart.findByIdAndUpdate(cart._id, {
      itemsCount: 0,
      total: 0,
    });

    return res.status(201).json({
      message: "Order created successfully",
      orderId: order._id,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err,
    });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
