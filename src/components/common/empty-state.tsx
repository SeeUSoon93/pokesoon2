export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-600">
      <p className="font-semibold text-slate-800">{title}</p>
      <p>{description}</p>
    </div>
  );
}
