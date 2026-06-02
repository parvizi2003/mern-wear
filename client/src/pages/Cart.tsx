import { useUser } from "@/api/auth/use-user"
import { useCart } from "@/api/cart/use-cart"
import { useCreateOrder } from "@/api/orders/use-create-order"
import CartItem from "@/components/cart-item"
import Container from "@/components/container"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

export default function Cart() {
  const { cart, isLoading } = useCart()
  const { user } = useUser()
  const { handleCreateOrder, createOrderIsPending } = useCreateOrder()
  const location = useLocation()

  if (isLoading || !cart) return <div>Loading...</div>

  if (!cart.items || cart.items.length === 0) {
    return (
      <Container className="flex h-svh flex-col justify-center pt-15">
        <div className="border p-8 text-center text-muted-foreground">
          Your cart is empty
        </div>
      </Container>
    )
  }

  return (
    <>
      {/* MOBILE */}
      <div className="flex h-svh flex-col pt-15 pb-4 md:hidden">
        <Container className="flex flex-1 flex-col overflow-y-auto">
          {cart.items.map((item) => (
            <CartItem item={item} key={item.id} />
          ))}
        </Container>

        <Container className="h-fit border border-t pt-4">
          <div className="flex justify-between">
            <span>Total items</span>
            <span>{cart.itemsCount}</span>
          </div>

          <div className="mt-2 flex justify-between font-semibold">
            <span>Total</span>
            <span>${cart.total.toFixed(2)}</span>
          </div>

          {!user ? (
            <Link to="/auth/login" state={location.pathname} className="w-full">
              <Button className="mt-4 w-full">Login to Checkout</Button>
            </Link>
          ) : (
            <Button
              className="mt-4 w-full"
              onClick={handleCreateOrder}
              disabled={createOrderIsPending}
            >
              {createOrderIsPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Checkout"
              )}
            </Button>
          )}
        </Container>
      </div>

      {/* DESKTOP  */}
      <Container className="flex h-svh justify-center gap-4 pt-19 pb-4">
        <div className="flex max-w-lg flex-1 flex-col overflow-y-auto border px-4">
          {cart.items.map((item) => (
            <CartItem item={item} key={item.id} />
          ))}
        </div>

        <div className="h-fit border-t p-4 md:min-w-xs md:border lg:w-sm">
          <div className="flex justify-between">
            <span>Total items</span>
            <span>{cart.itemsCount}</span>
          </div>

          <div className="mt-2 flex justify-between font-semibold">
            <span>Total</span>
            <span>${cart.total.toFixed(2)}</span>
          </div>

          {!user ? (
            <Link to="/auth/login" state={location.pathname} className="w-full">
              <Button className="mt-4 w-full">Login to Checkout</Button>
            </Link>
          ) : (
            <Button
              className="mt-4 w-full"
              onClick={handleCreateOrder}
              disabled={createOrderIsPending}
            >
              {createOrderIsPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Checkout"
              )}
            </Button>
          )}
        </div>
      </Container>
    </>
  )
}
