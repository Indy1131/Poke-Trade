type Props = {
  type?: string;
  name: string;
  label: string;
  className: string;
  noLabel?: boolean;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  error?: string[] | null | undefined | string;
};

export default function Input({
  type,
  name,
  label,
  className,
  noLabel,
  value,
  onChange,
  onFocus,
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
        className="border-2 border-outline box-border rounded-md w-full p-2 border-outline"
        // style={{ boxShadow: "0 0px 3px 0px #9D033A" }}
        autoComplete="off"
        placeholder={label}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
      />
      <h1 className="text-primary h-[1rem] my-1">{error ? error[0] : ""}</h1>
    </div>
  );
}
