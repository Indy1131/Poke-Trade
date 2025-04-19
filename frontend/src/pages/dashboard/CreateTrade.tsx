import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import Button from "../../components/form/Button";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import PokeCard from "../../components/cards/PokeCard";
import Stats from "../../components/Stats";
import Type from "../../components/Type";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function CreateTrade() {
  const { token } = useAuth();
  const [selected, setSelected] = useState(0);
  const [listingData, setListingData] = useState(null);
  const [data, setData] = useState(null);
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const search = searchParams.get("keyword");

  function handleSelectClick(i) {
    setSelected(i);
  }

  async function handleTradeClick() {
    if (!data || selected >= data.length || !data[selected]) return;

    let url = `${BASE_URL}/api/trade/create/`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        original: listingData.pokemon.id,
        offer: data[selected].id,
      }),
    });

    navigate("/dashboard/trades");
  }

  useEffect(() => {
    let url = `${BASE_URL}/api/pokemon/user_pokemon/`;
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
    setSelected(0);
    getData();
  }, [search, token]);

  useEffect(() => {
    let url = `${BASE_URL}/api/trade/listings/${id}/`;

    async function getData() {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await response.json();
      setListingData(json);
    }
    getData();
  }, [token, id]);

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
              Counter Offer
            </h1>
          </div>
          <div className="w-full px-10 flex flex-col lg:flex-row">
            <div className="flex-1 mb-6 gap-6">
              <h1 className="text-xl mb-3">
                {listingData
                  ? `${listingData.pokemon.owner_user.username}'s ${listingData.pokemon.api_data.name}`
                  : "Loading"}
              </h1>
              <div className="flex gap-6">
                <div>
                  <div className="border-2 border-outline rounded-md flex flex-col items-center relative h-[200px] w-[200px] overflow-hidden p-2 bg-gradient-to-tr from-outline via-white to-white">
                    <h1 className="absolute top-1 left-1 text-xl text-outline">
                      {listingData
                        ? listingData.pokemon.api_data.name
                        : "Loading"}
                    </h1>
                    <div className="flex-1 w-full relative">
                      {listingData && (
                        <img
                          src={listingData.pokemon.api_data.sprite}
                          className="w-full h-full"
                          style={{ imageRendering: "pixelated" }}
                        />
                      )}
                    </div>
                  </div>
                  {listingData && (
                    <div className="mt-2 flex gap-1">
                      {listingData.pokemon.api_data.types.map((type) => {
                        return <Type key={type} name={type} />;
                      })}
                    </div>
                  )}
                </div>
                {listingData && (
                  <div className="flex-1 max-w-[500px]">
                    <Stats data={listingData.pokemon} />
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 mb-6 gap-6">
              <h1 className="text-xl mb-3">
                {data && data.length > 0 ? "Your offer" : "Invalid Offer"}
              </h1>
              <div className="flex gap-6">
                <div>
                  <div className="border-2 border-outline rounded-md flex flex-col items-center relative h-[200px] w-[200px] overflow-hidden p-2 bg-gradient-to-tr from-outline via-white to-white">
                    <h1 className="absolute top-1 left-1 text-xl text-outline">
                      {data && data.length > 0
                        ? data[selected].api_data.name
                        : "Invalid Pokemon"}
                    </h1>
                    <div className="flex-1 w-full relative">
                      {data && data.length > 0 && (
                        <img
                          src={data[selected].api_data.sprite}
                          className="w-full h-full"
                          style={{ imageRendering: "pixelated" }}
                        />
                      )}
                    </div>
                  </div>
                  {data && data.length > 0 && (
                    <div className="mt-2 flex gap-1">
                      {data[selected].api_data.types.map((type) => {
                        return <Type key={type} name={type} />;
                      })}
                    </div>
                  )}
                </div>
                {data && data.length > 0 && (
                  <div className="flex-1 max-w-[500px]">
                    <Stats data={data[selected]} />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="w-full px-10 flex gap-3">
            <Link className="flex-1" to="/dashboard/market">
              <Button text="Cancel" appearance="cancel" className="w-full" />
            </Link>
            <Button
              text="Trade"
              className="flex-1"
              onClick={handleTradeClick}
            />
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
            className="grid w-full p-6 justify-center"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
            }}
          >
            {data ? (
              data.length == 0 ? (
                "No Pokemon found."
              ) : (
                data.map((pokemon, i) => {
                  return (
                    <PokeCard
                      key={pokemon.id}
                      pokemon={pokemon}
                      onClick={() => handleSelectClick(i)}
                      selected={i == selected}
                    />
                  );
                })
              )
            ) : (
              <>
                <PokeCard />
                <PokeCard />
                <PokeCard />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
