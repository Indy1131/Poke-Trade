type props = {
  className?: string;
  text: string;
};

export default function Button({ className, text }: props) {
  return (
    <button
      className={`cursor-pointer bg-gradient-to-tr text-white from-primary to-secondary rounded-xl p-4 ${className}`}
    >
      {text}
    </button>
  );
}
