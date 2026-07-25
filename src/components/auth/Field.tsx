export function Field({
  label,
  name,
  type = "text",
  autoComplete,
  required,
  defaultValue,
  error,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  defaultValue?: string;
  error?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-brand-navy-500"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        className={`mt-1.5 w-full rounded-xl border bg-white px-4 py-2.5 text-brand-navy-500 outline-none transition-colors placeholder:text-brand-navy-500/35 focus:border-brand-navy-500 ${
          error ? "border-red-400" : "border-brand-navy-500/15"
        }`}
      />
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
}
