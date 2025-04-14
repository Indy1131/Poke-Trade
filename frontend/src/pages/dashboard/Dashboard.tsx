import PokeCard from "../../components/cards/PokeCard";
import { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar";
import { Link, useSearchParams } from "react-router-dom";

const sample = {
  name: "Groudon",
  id: 1,
};

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState("hello");

  const search = searchParams.get("keyword");

  useEffect(() => {
    console.log("we here");
  }, [searchParams]);

  if (!data) return <h1>Loading...</h1>;

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
              <img src="/pokeicon.png" className="h-[4rem] w-[4rem] inline mr-3 pb-1 px-1" />
              My Collection
            </h1>
            <h1 className="px-10">
              Want more Pokemon?{" "}
              <Link
                to="/dashboard/market"
                className="bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent"
              >
                Go to the market
              </Link>
            </h1>
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
            className="grid grid-cols-2 justify-center w-full p-10 gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            }}
          >
            <PokeCard pokemon={sample} />
            <PokeCard pokemon={sample} />
            <PokeCard pokemon={sample} />
            <PokeCard pokemon={sample} />
            <PokeCard pokemon={sample} />
            <PokeCard pokemon={sample} />
            <PokeCard pokemon={sample} />
            <PokeCard pokemon={sample} />
            <PokeCard pokemon={sample} />
            <PokeCard pokemon={sample} />
            <PokeCard pokemon={sample} />
            <PokeCard pokemon={sample} />
            <PokeCard pokemon={sample} />
            <PokeCard pokemon={sample} />
            <PokeCard pokemon={sample} />
            <PokeCard pokemon={sample} />
            <PokeCard pokemon={sample} />
            <PokeCard pokemon={sample} />
            <PokeCard pokemon={sample} />
            <PokeCard pokemon={sample} />
            <PokeCard pokemon={sample} />
            <PokeCard pokemon={sample} />
            <PokeCard pokemon={sample} />
            <PokeCard pokemon={sample} />
          </div>
        </div>
      </div>
    </>
  );
}
