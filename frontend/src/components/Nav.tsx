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
        {/* <div className="absolute flex justify-center w-full top-0 h-[calc(4rem+100px)] pointer-events-none overflow-hidden">
          <div
            className="top-0 w-[calc(100vw+100px)] flex-none h-[4rem]"
            style={{ boxShadow: "0px 30px 30px 0 white" }}
          />
        </div> */}
        <div className="w-full h-full flex items-center px-3 gap-8 bg-white text-xs sm:text-sm">
          {path.startsWith("/dashboard") ? (
            <>
              <Link to="/dashboard" className="hidden sm:block">Poke Trade</Link>
              <Link to="/dashboard/market" className="ml-auto hidden sm:block">
                Market
              </Link>
              <Link to="/dashboard/trades" className="hidden sm:block">Trades</Link>
              <Link to="/dashboard/transactions" className="hidden sm:block">Transactions</Link>
              {user && (
                <div className="flex items-center gap-2 w-[200px] py-2 px-2 select-none">
                  <h1 className=" bg-gradient-to-tr from-primary via-secondary to-secondary rounded-full text-center w-[2.5rem] h-[2.5rem] pt-[2px] flex items-center justify-center text-xl text-white">
                    {user.username[0].toUpperCase()}
                  </h1>
                  <div>
                    <h1 className="text-xs">{user.username}</h1>
                    <h1 className="ml-auto text-green-400 text-xs">
                      ${user.balance}
                    </h1>
                  </div>
                  <button
                    onClick={handleClick}
                    className="text-sm ml-auto cursor-pointer h-[1.4rem] w-[1.4rem]"
                  >
                    <img src="/log-out.png" />
                  </button>
                </div>
              )}
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
