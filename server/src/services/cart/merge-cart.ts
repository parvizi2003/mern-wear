import { Cart, CartItem } from "../../models/cart";
import { recalculateCart } from "./recalculate-cart";
export const mergeCart = async (params: {
  sessionId?: string;
  userId: string;
}) => {
  const { sessionId, userId } = params;

  if (!sessionId) throw new Error("Session Id not found");

  const sessionCart = await Cart.findOne({ sessionId });

  if (!sessionCart) throw new Error("Session Cart not found");

  let userCart = await Cart.findOne({ user: userId });

  if (!userCart) {
    userCart = await Cart.create({
      user: userId,
    });
  }

  const items = await CartItem.find({
    cart: sessionCart._id,
  });

  for (const item of items) {
    const existing = await CartItem.findOne({
      cart: userCart._id,
      product: item.product,
      variant: item.variant,
      size: item.size,
    });

    if (existing) {
      existing.quantity += item.quantity;
      await existing.save();
    } else {
      await CartItem.create({
        cart: userCart._id,
        product: item.product,
        variant: item.variant,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
      });
    }
  }

  await recalculateCart(userCart.id);
  await CartItem.deleteMany({ cart: sessionCart._id });
  await Cart.findByIdAndDelete(sessionCart._id);

  return userCart;
};
