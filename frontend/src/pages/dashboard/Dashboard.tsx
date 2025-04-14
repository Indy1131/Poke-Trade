import PokeCard from "../../components/cards/PokeCard";
import { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

type Pokemon = {
  api_data: { sprite: string; name: string; types: string[] };
  id: number;
  owner_user: number;
  poke_dex_id: number;
};

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Dashboard() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<Pokemon[] | null>(null);

  const search = searchParams.get("keyword");

  console.log(data);

  useEffect(() => {
    let url = `${BASE_URL}/api/pokemon/user_pokemon/`;
    if (search) url += `?keyword=${search}`;

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
            className="grid w-full p-6 gap-6"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            }}
          >
            {data
              ? data.length == 0
                ? "No Pokemon found."
                : data.map((pokemon: Pokemon) => {
                    return <PokeCard key={pokemon.id} pokemon={pokemon} />;
                  })
              : "Loading..."}
          </div>
        </div>
      </div>
    </>
  );
}
