export default function NewOrderPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">New Order</h2>
      </div>
      <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-800">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          WhatsApp Parser
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Paste customer orders here to extract items and delivery details (coming in Phase 3).
        </p>
      </div>
    </div>
  );
}

