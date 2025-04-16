import { Link, useSearchParams } from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import PokeCard from "../../components/cards/PokeCard";
import Skeleton from "../../components/cards/Skeleton";
import Listing from "../../components/cards/Listing";

export default function Market() {
  const [searchParams] = useSearchParams();

  const search = searchParams.get("keyword");

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
              Market
            </h1>
            <h1 className="px-10">
              Want to check your offers?{" "}
              <Link
                to="/dashboard/transactions"
                className="bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent"
              >
                View your trades
              </Link>
            </h1>
          </div>
          <div className="w-full pt-6 text-4xl px-10 relative overflow-hidden">
            <h1>My Listings</h1>
            <div className="absolute h-full w-[10px] bg-gradient-to-r from-white to-transparent z-3" />
            <div className="absolute right-10 h-full w-[10px] bg-gradient-to-l from-white to-transparent z-3" />
            <div className="w-full overflow-scroll relative">
              <div className="flex items-center my-5 w-max px-[10px]">
                <Listing />
                <Listing />
                <Listing />
              </div>
            </div>
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
            className="grid w-full p-6 gap-2"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            }}
          >
            {/* {data ? (
              data.length == 0 ? (
                "No Pokemon found."
              ) : (
                data.map((pokemon: Pokemon) => {
                  return <PokeCard key={pokemon.id} pokemon={pokemon} />;
                })
              )
            ) : (
              <>
                <Skeleton />
                <Skeleton />
                <Skeleton />
              </>
            )} */}
            <Listing />
            <Listing />
            <Listing />
          </div>
        </div>
      </div>
    </>
  );
}
