export default function Button({ className }: { className?: string }) {
  return (
    <button className={`bg-primary rounded-xl p-4 ${className}`}>Button</button>
  );
}
