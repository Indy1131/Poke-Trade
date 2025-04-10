type Props = {
  type?: string;
  name: string;
  label: string;
  className: string;
  noLabel?: boolean;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  error?: string[] | null;
};

export default function Input({
  type,
  name,
  label,
  className,
  noLabel,
  value,
  onChange,
  error,
}: Props) {
  return (
    <div className={className}>
      {!noLabel && (
        <label htmlFor={name} className="font-medium">
          {label}
        </label>
      )}
      <input
        type={type ? type : "text"}
        className="border-2 border-outline box-border rounded-md w-full p-2"
        autoComplete="off"
        placeholder={label}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
      />
      <h1 className="text-secondary h-[1rem] mb-2">{error ? error[0] : ""}</h1>
    </div>
  );
}
