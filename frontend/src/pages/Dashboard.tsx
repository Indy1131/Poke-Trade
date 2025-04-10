import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
  const { isAuthenticated, logout } = useAuth();

  function handleClick() {
    logout();
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <button className="bg-blue-500 w-[400px]" onClick={handleClick}>
      Logout
    </button>
  );
}
