"use client";

export function DeleteProductButton({
  action,
  productName,
}: {
  action: () => void;
  productName: string;
}) {
  return (
    <form action={action}>
      <button
        type="submit"
        onClick={(e) => {
          if (!confirm(`Delete "${productName}" permanently? This can't be undone.`)) {
            e.preventDefault();
          }
        }}
        className="text-xs uppercase tracking-[0.1em] text-magenta hover:underline"
      >
        Delete
      </button>
    </form>
  );
}
