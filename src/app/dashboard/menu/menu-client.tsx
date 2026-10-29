"use client";

import { useState } from "react";
import {
  addMenuItemAction,
  updateMenuItemAction,
  toggleMenuItemStatusAction,
} from "./actions";

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  aliases: string[];
  is_active: boolean;
}

export function MenuClient({ initialItems }: { initialItems: MenuItem[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form-specific error states
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [addError, setAddError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleAdd(formData: FormData) {
    setAddError(null);
    setGlobalError(null);
    setLoadingId("add");

    const result = await addMenuItemAction(formData);
    setLoadingId(null);

    if (!result.ok) {
      setAddError(result.error);
    } else {
      setIsAdding(false);
    }
  }

  async function handleUpdate(formData: FormData) {
    setEditError(null);
    setGlobalError(null);
    const id = formData.get("id") as string;
    setLoadingId(id);

    const result = await updateMenuItemAction(formData);
    setLoadingId(null);

    if (!result.ok) {
      setEditError(result.error);
    } else {
      setEditingId(null);
    }
  }

  async function handleToggleStatus(id: string, currentStatus: boolean) {
    setGlobalError(null);
    setLoadingId(id);

    const formData = new FormData();
    formData.append("id", id);
    formData.append("is_active", String(!currentStatus));

    const result = await toggleMenuItemStatusAction(formData);
    setLoadingId(null);

    if (!result.ok) {
      setGlobalError(result.error);
    }
  }

  const activeCount = initialItems.filter((i) => i.is_active).length;

  return (
    <div className="space-y-4">
      {/* Header with Title and Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Menu Items
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {activeCount} active {activeCount === 1 ? "item" : "items"}
          </p>
        </div>
        <button
          onClick={() => {
            setIsAdding(!isAdding);
            setEditingId(null);
            setAddError(null);
            setEditError(null);
            setGlobalError(null);
          }}
          className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-amber-500 active:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400"
        >
          {isAdding ? "Cancel" : "+ Add Item"}
        </button>
      </div>

      {/* Global / Action Error */}
      {globalError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          {globalError}
        </div>
      )}

      {/* Add New Item Form */}
      {isAdding && (
        <form
          action={handleAdd}
          className="space-y-3 rounded-xl border border-amber-200 bg-amber-50/50 p-4 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/20"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              New Menu Item
            </h3>
            <span className="text-[10px] text-gray-500 dark:text-gray-400">
              Max 80 chars
            </span>
          </div>

          {addError && (
            <div className="rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300">
              {addError}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              Item Name *
            </label>
            <input
              name="name"
              type="text"
              maxLength={80}
              placeholder="e.g. Chocolate Cake 6''"
              required
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-neutral-900 shadow-sm focus:border-amber-500 focus:outline-none dark:border-gray-700 dark:bg-neutral-900 dark:text-neutral-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              Price (RM) *
            </label>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0.01"
              max="9999.99"
              placeholder="e.g. 45.00"
              required
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-neutral-900 shadow-sm focus:border-amber-500 focus:outline-none dark:border-gray-700 dark:bg-neutral-900 dark:text-neutral-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              Aliases (comma-separated, max 15)
            </label>
            <input
              name="aliases"
              type="text"
              placeholder="e.g. choc cake, kek coklat, 巧克力蛋糕"
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-neutral-900 shadow-sm focus:border-amber-500 focus:outline-none dark:border-gray-700 dark:bg-neutral-900 dark:text-neutral-100"
            />
            <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
              Used by AI to match customer messages in English, Malay, or Chinese.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setAddError(null);
              }}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-neutral-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loadingId === "add"}
              className="rounded-md bg-amber-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-amber-500 disabled:opacity-50 dark:bg-amber-500 dark:hover:bg-amber-400"
            >
              {loadingId === "add" ? "Saving..." : "Save Item"}
            </button>
          </div>
        </form>
      )}

      {/* Menu Items List */}
      <div className="space-y-2.5">
        {initialItems.length === 0 ? (
          /* Empty State */
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-800">
            <svg
              className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
              />
            </svg>
            <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              No menu items yet
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Add your baked goods and food items to help AI extract customer orders.
            </p>
          </div>
        ) : (
          initialItems.map((item) => {
            const isEditing = editingId === item.id;
            return (
              <div
                key={item.id}
                className={`rounded-xl border p-3.5 transition-all ${
                  item.is_active
                    ? "border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-neutral-900"
                    : "border-gray-200/60 bg-gray-50/70 opacity-60 dark:border-gray-800/60 dark:bg-neutral-900/40"
                }`}
              >
                {isEditing ? (
                  /* Inline Edit Form */
                  <form action={handleUpdate} className="space-y-3">
                    <input type="hidden" name="id" value={item.id} />
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                        Edit Item
                      </span>
                    </div>

                    {editError && (
                      <div className="rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300">
                        {editError}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                        Item Name *
                      </label>
                      <input
                        name="name"
                        type="text"
                        maxLength={80}
                        defaultValue={item.name}
                        required
                        className="mt-1 w-full rounded-md border border-gray-300 bg-white px-2.5 py-1 text-sm text-neutral-900 focus:border-amber-500 focus:outline-none dark:border-gray-700 dark:bg-neutral-950 dark:text-neutral-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                        Price (RM) *
                      </label>
                      <input
                        name="price"
                        type="number"
                        step="0.01"
                        min="0.01"
                        max="9999.99"
                        defaultValue={Number(item.price).toFixed(2)}
                        required
                        className="mt-1 w-full rounded-md border border-gray-300 bg-white px-2.5 py-1 text-sm text-neutral-900 focus:border-amber-500 focus:outline-none dark:border-gray-700 dark:bg-neutral-950 dark:text-neutral-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                        Aliases (comma-separated, max 15)
                      </label>
                      <input
                        name="aliases"
                        type="text"
                        defaultValue={item.aliases?.join(", ") ?? ""}
                        className="mt-1 w-full rounded-md border border-gray-300 bg-white px-2.5 py-1 text-sm text-neutral-900 focus:border-amber-500 focus:outline-none dark:border-gray-700 dark:bg-neutral-950 dark:text-neutral-100"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setEditError(null);
                        }}
                        className="rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-neutral-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loadingId === item.id}
                        className="rounded-md bg-amber-600 px-3 py-1 text-xs font-semibold text-white hover:bg-amber-500 disabled:opacity-50 dark:bg-amber-500 dark:hover:bg-amber-400"
                      >
                        {loadingId === item.id ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Item Display Card */
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                            {item.name}
                          </span>
                          {!item.is_active && (
                            <span className="rounded bg-gray-200 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-neutral-800 dark:text-gray-400">
                              Inactive
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                          RM {Number(item.price).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingId(item.id);
                            setIsAdding(false);
                            setEditError(null);
                            setGlobalError(null);
                          }}
                          className="rounded border border-gray-300 px-2 py-1 text-[11px] font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-neutral-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleStatus(item.id, item.is_active)}
                          disabled={loadingId === item.id}
                          className={`rounded px-2 py-1 text-[11px] font-medium transition-colors ${
                            item.is_active
                              ? "border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:text-red-400 dark:hover:bg-red-950/30"
                              : "border border-green-200 text-green-600 hover:bg-green-50 dark:border-green-900/40 dark:text-green-400 dark:hover:bg-green-950/30"
                          }`}
                        >
                          {loadingId === item.id
                            ? "Updating..."
                            : item.is_active
                            ? "Deactivate"
                            : "Reactivate"}
                        </button>
                      </div>
                    </div>

                    {item.aliases && item.aliases.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {item.aliases.map((alias, idx) => (
                          <span
                            key={idx}
                            className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600 dark:bg-neutral-800 dark:text-gray-400"
                          >
                            {alias}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
