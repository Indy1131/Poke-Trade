type props = {
  className?: string;
  text: string;
};

export default function Button({ className, text }: props) {
  return (
    <button
      className={`bg-gradient-to-t from-primary to-secondary rounded-xl p-4 ${className}`}
    >
      {text}
    </button>
  );
}
