import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
  const { logout } = useAuth();

  function handleClick() {
    logout();
  }

  return (
    <button className="bg-blue-500 w-[400px]" onClick={handleClick}>
      Logout
    </button>
  );
}
