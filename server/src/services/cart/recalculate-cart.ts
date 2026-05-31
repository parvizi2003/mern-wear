import { CartItem } from "../../models/cart";
import type { CartDoc } from "../../dtos/cart-dto";

export const recalculateCart = async (cart: CartDoc) => {
  const items = await CartItem.find({ cart: cart._id });

  const itemsCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + i.quantity * i.price, 0);

  cart.itemsCount = itemsCount;
  cart.total = total;

  await cart.save();
};
