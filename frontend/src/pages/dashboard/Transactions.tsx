import { Link, useSearchParams } from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import Transaction from "../../components/cards/Transaction";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Transactions() {
  const [searchParams] = useSearchParams();
  const { token } = useAuth();
  const [data, setData] = useState(null);

  const search = searchParams.get("keyword");

  useEffect(() => {
    let url = `${BASE_URL}/api/trade/transactions/`;
    if (search) url += `?search=${search}`;

    async function getData() {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await response.json();
      setData(json);
    }

    getData();
  }, [token, search]);

  console.log(data);

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
              My Transactions
            </h1>
            <h1 className="px-10">
              Want to check see your Pokemon?{" "}
              <Link
                to="/dashboard"
                className="bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent"
              >
                Go to your collection
              </Link>
            </h1>
            <div className="sticky top-0 bg-gradient-to-b from-white to-transparent w-full z-1">
              <SearchBar className="w-full" />
            </div>
            <h1 className="px-10 block w-full mb-3">
              {search ? "Showing results for " : "Showing "}
              <span className="bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent italic pr-2">
                {search ? search : "all results"}
              </span>
            </h1>
            <div className="px-10 flex flex-col gap-4">
              {data ? (
                data.map((transaction) => {
                  return (
                    <Transaction
                      key={transaction.id}
                      transaction={transaction}
                    />
                  );
                })
              ) : (
                <>
                  <Transaction />
                  <Transaction />
                  <Transaction />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
