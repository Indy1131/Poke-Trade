type Props = {
  name: string;
  label: string;
  className: string;
  noLabel?: boolean;
};

export default function Input({ name, label, className, noLabel }: Props) {
  return (
    <div className={className}>
      {!noLabel && (
        <label htmlFor={name} className="font-medium">
          {label}
        </label>
      )}
      <input
        className="border-2 border-outline box-border rounded-md w-full p-2"
        autoComplete="off"
        placeholder={label}
        name={name}
        id={name}
      />
    </div>
  );
}
