import { useOrders } from "@/api/orders/use-orders"
import Container from "@/components/container"
import { cn } from "@/lib/utils"

export default function Orders() {
  const { orders, isLoading } = useOrders()

  if (!orders || isLoading) {
    return (
      <Container className="flex h-svh flex-col justify-center pt-15">
        <div className="border p-8 text-center text-muted-foreground">
          Your orders are empty
        </div>
      </Container>
    )
  }
  return (
    <div className="flex h-svh flex-col pt-15 pb-4">
      <Container className="overflow-y-aut flex flex-1 flex-col gap-4 pt-4">
        {orders.map((order) => (
          <div key={order.id} className="border p-4">
            <h3 className="mb-2 font-semibold">Order: {order.id}</h3>
            <p className="mb-1 text-sm">Total: ${order.total.toFixed(2)}</p>
            <p className="mb-1 text-sm">Items Count: {order.itemsCount}</p>
            <p className="mb-1 text-sm">
              Status:
              <span
                className={cn(
                  "ml-2 inline-block px-2 leading-8",
                  order.status === "success"
                    ? "bg-green-500"
                    : order.status === "cancelled"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                )}
              >
                {order.status}
              </span>
            </p>
          </div>
        ))}
      </Container>
    </div>
  )
}
