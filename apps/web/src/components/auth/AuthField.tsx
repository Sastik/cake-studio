export default function AuthField({
  label,
  value,
  onChange,
  placeholder,
  type,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block space-y-1">
      <div className="text-xs font-semibold text-slate-700">{label}</div>
      <input
        type={type ?? "text"}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm shadow-soft outline-none focus:border-blush-200"
      />
    </label>
  );
}

