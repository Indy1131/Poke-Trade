import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import Trade from "../../components/cards/Trade";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Trades() {
  const { token } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    async function getData() {
      const response = await fetch(`${BASE_URL}/api/trade/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await response.json();
      setData(json);
    }

    getData();
  }, [token]);

  const outbound = data ? data.outbound : null;
  const inbound = data ? data.inbound : null;

  return (
    <>
      <div className="fixed bg-gradient-to-b from-secondary to-primary w-full pointer-events-none h-[calc(100%-8rem)] z-[-1]">
        <div className="absolute bg-gradient-to-b from-white to-transparent w-full h-[200px] top-0 z-0" />
        <div className="absolute bg-gradient-to-t from-white to-transparent w-full h-[200px] bottom-0 z-0" />
      </div>
      <div className=" w-full flex justify-center flex-1 relative">
        <div className="w-[calc(100%-60px)] mt-10 bg-white rounded-t-3xl z-2 pt-10 flex flex-col items-center">
          <div className="w-full">
            <h1 className="text-4xl font-medium py-2 mb-4 bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent inline-block px-10">
              <img
                src="/pokeicon.png"
                className="h-[4rem] w-[4rem] inline mr-3 pb-1 px-1"
              />
              My Trades
            </h1>
            <h1 className="px-10 mb-3">
              Want to check see your trade history?{" "}
              <Link
                to="/dashboard/transactions"
                className="bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent"
              >
                Go to your transactions
              </Link>
            </h1>
            <div className="w-full pt-6 px-10 relative overflow-hidden">
              <h1 className="text-3xl font-medium mb-6">Outbound</h1>
              {outbound ? (
                outbound.length == 0 ? (
                  <h1 className="text-sm py-2">
                    You currently have no outgoing trades.
                  </h1>
                ) : (
                  <>
                    <div className="absolute h-full w-[10px] bg-gradient-to-r from-white to-transparent z-3" />
                    <div className="absolute right-10 h-full w-[200px] bg-gradient-to-l from-white to-transparent z-3" />
                    <div className="w-full overflow-x-scroll overflow-y-hidden relative h-[320px] pb-12 pt-4 box-content">
                      <div className="flex items-center w-max pl-[10px] pr-[200px] h-full gap-5">
                        {outbound.map((trade) => {
                          return <Trade key={trade.id} trade={trade} />;
                        })}
                      </div>
                    </div>
                  </>
                )
              ) : (
                <div className="w-full overflow-x-scroll overflow-y-hidden relative h-[210px] pb-8 pt-4 box-content" />
              )}
            </div>
            <div className="w-full pt-6 px-10 relative overflow-hidden">
              <h1 className="text-3xl font-medium mb-6">Inbound</h1>
              {inbound ? (
                inbound.length == 0 ? (
                  <h1 className="text-sm py-2">
                    You currently have no incoming trades.
                  </h1>
                ) : (
                  <>
                    <div className="absolute h-full w-[10px] bg-gradient-to-r from-white to-transparent z-3" />
                    <div className="absolute right-10 h-full w-[200px] bg-gradient-to-l from-white to-transparent z-3" />
                    <div className="w-full overflow-x-scroll overflow-y-hidden relative h-[320px] pb-12 pt-4 box-content">
                      <div className="flex items-center w-max pl-[10px] pr-[200px] h-full gap-5">
                        {inbound.map((trade) => {
                          return <Trade key={trade.id} trade={trade} inbound />;
                        })}
                      </div>
                    </div>
                  </>
                )
              ) : (
                <div className="w-full overflow-x-scroll overflow-y-hidden relative h-[210px] pb-8 pt-4 box-content" />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
