type props = {
  className?: string;
  text: string;
  appearance?: "default" | "cancel";
  onClick?: () => void;
  type?: "submit" | "reset" | "button" | undefined;
};

export default function Button({
  className,
  text,
  onClick,
  type = "submit",
  appearance = "default",
}: props) {
  return (
    <>
      {appearance === "default" ? (
        <button
          className={`cursor-pointer bg-gradient-to-tr text-white from-primary to-secondary rounded-xl p-4 ${className}`}
          onClick={onClick}
          type={type}
        >
          {text}
        </button>
      ) : (
        <button
          className={`cursor-pointer box-border border-2 border-outline text-black rounded-xl p-4 ${className}`}
          onClick={onClick}
          type={type}
        >
          {text}
        </button>
      )}
    </>
  );
}
