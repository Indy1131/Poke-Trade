import { Link, useSearchParams } from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import Listing from "../../components/cards/Listing";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Market() {
  const { token, user } = useAuth();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState(null);

  const search = searchParams.get("keyword");

  useEffect(() => {
    let url = `${BASE_URL}/api/trade/listings/`;
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
  }, [search, token]);

  const listings = data ? data.listings : null;
  const myListings = data ? data.myListings : null;

  return (
    <>
      <div className="fixed bg-gradient-to-b from-secondary to-primary w-full pointer-events-none h-[calc(100%-8rem)] z-[-1]">
        <div className="absolute bg-gradient-to-b from-white to-transparent w-full h-[200px] top-0 z-0 pointer-events-none" />
        <div className="absolute bg-gradient-to-t from-white to-transparent w-full h-[200px] bottom-0 z-0 pointer-events-none" />
      </div>
      <div className=" w-full flex justify-center flex-1 relative">
        <div className="w-[calc(100%-60px)] mt-10 bg-white rounded-t-3xl z-2 pt-10 flex flex-col items-center">
          <div className="w-full">
            <h1 className="text-4xl font-medium py-2 mb-4 bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent inline-block px-10">
              <img
                src="/pokeicon.png"
                className="h-[4rem] w-[4rem] inline mr-3 pb-1 px-1"
              />
              Market
            </h1>
            <h1 className="px-10">
              Want to check your offers?{" "}
              <Link
                to="/dashboard/trades"
                className="bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent"
              >
                Go to your trades
              </Link>
            </h1>
          </div>
          <div className="w-full pt-6 text-4xl px-10 relative overflow-hidden">
            <h1>My Listings</h1>
            {myListings ? (
              myListings.length == 0 ? (
                <h1 className="text-sm py-2">
                  Your currently have no listings.
                </h1>
              ) : (
                <>
                  <div className="absolute h-full w-[10px] bg-gradient-to-r from-white to-transparent z-3 pointer-events-none" />
                  <div className="absolute right-10 h-full w-[200px] bg-gradient-to-l from-white to-transparent z-3 pointer-events-none" />
                  <div className="w-full overflow-x-scroll overflow-y-hidden relative h-[210px] pb-12 pt-4 box-content">
                    <div className="flex items-center w-max pl-[10px] pr-[200px] h-full">
                      {myListings.map((listing) => {
                        return <Listing key={listing.id} listing={listing} />;
                      })}
                    </div>
                  </div>
                </>
              )
            ) : (
              <div className="w-full overflow-x-scroll overflow-y-hidden relative h-[210px] pb-8 pt-4 box-content" />
            )}
          </div>
          <div className="w-full px-10 pt-6 text-4xl">
            <h1>Market Listings</h1>
          </div>
          <div className="sticky top-0 bg-gradient-to-b from-white to-transparent w-full z-1">
            <SearchBar className="w-full" />
          </div>
          <h1 className="px-10 block w-full">
            {search ? "Showing results for " : "Showing "}
            <span className="bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent italic pr-2">
              {search ? search : "all results"}
            </span>
          </h1>
          <div
            className="grid w-full p-6 justify-center gap-y-6"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
            }}
          >
            {listings ? (
              listings.length == 0 ? (
                "No Pokemon found."
              ) : (
                listings.map((listing) => {
                  return <Listing key={listing.id} listing={listing} />;
                })
              )
            ) : (
              <>
                <Listing />
                <Listing />
                <Listing />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
