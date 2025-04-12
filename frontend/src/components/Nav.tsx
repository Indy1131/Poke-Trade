import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Nav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const location = useLocation();
  const path = location.pathname;

  function handleClick() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <nav className="w-[100vw] sticky top-0 z-10">
      <div className="w-full h-[4rem] z-20 font-medium">
        {/* <div className="absolute flex justify-center w-full top-0 h-[calc(4rem+20px)] pointer-events-none overflow-hidden">
          <div
            className="top-0 w-[calc(100vw+100px)] flex-none h-[4rem]"
            style={{ boxShadow: "0px 4px 20px -10px black" }}
          />
        </div> */}
        <div className="w-full h-full flex items-center px-3 gap-8 bg-white">
          {path.startsWith("/dashboard") ? (
            <>
              <Link to="/dashboard">Poke Trade</Link>
              <h1 className="ml-auto text-green-400">$10000</h1>
              <Link to="/dashboard/market">
                Market
              </Link>
              <Link to="/dashboard/transactions">Transactions</Link>
              {user && (
                <h1 className="w-[200px] bg-amber-300 text-center">
                  {user.username}
                </h1>
              )}
              <button onClick={handleClick}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/">Poke Trade</Link>
              <Link to="/login" className="ml-auto">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
