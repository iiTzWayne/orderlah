export default function OrdersPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Orders</h2>
      </div>
      <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-800">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          No orders yet
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Orders parsed from WhatsApp messages will appear here.
        </p>
      </div>
    </div>
  );
}

