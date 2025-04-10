export default function Button({ className }: { className?: string }) {
  return (
    <button className={`bg-gradient-to-t from-primary to-secondary rounded-xl p-4 ${className}`}>Button</button>
  );
}
