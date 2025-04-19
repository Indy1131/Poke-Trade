import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Type from "../../components/Type";
import Button from "../../components/form/Button";
import Input from "../../components/form/Input";
import Stats from "../../components/Stats";
import Pokemon from "./Pokemon";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function PokemonListing() {
  const { user, token, refreshUser } = useAuth();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handlePurchaseClick() {
    const response = await fetch(
      `${BASE_URL}/api/trade/listings/${id}/purchase/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status == 200) {
      refreshUser();
      navigate("/dashboard");
      return;
    }

    const json = await response.json();
    setError(json.detail);
  }

  function handleCounterClick() {
    navigate(`/dashboard/create_trade/${id}`)
  }

  useEffect(() => {
    async function getData() {
      const response = await fetch(`${BASE_URL}/api/trade/listings/${id}/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await response.json();
      setData(json);
    }

    getData();
  }, [id, token]);

  // const name = data
  //   ? data.api_data.name[0].toUpperCase() + data.api_data.name.substring(1)
  //   : "Undefined";

  const name = data ? data.pokemon.api_data.name : "undefined";

  if (data && data.pokemon.owner_user.id == user.id)
    return <Pokemon poke_id={data.pokemon.id} fromMarket />;

  return (
    <>
      <div className="fixed bg-gradient-to-b from-secondary to-primary w-full pointer-events-none h-[calc(100%-8rem)] z-[-1]">
        <div className="absolute bg-gradient-to-b from-white to-transparent w-full h-[200px] top-0 z-0" />
        <div className="absolute bg-gradient-to-t from-white to-transparent w-full h-[200px] bottom-0 z-0" />
      </div>
      <div className=" w-full flex justify-center flex-1 relative">
        <div className="w-[calc(100%-60px)] mt-10 bg-white rounded-t-3xl z-2 pt-10 flex flex-col items-center">
          <div className="w-[min(1200px,calc(100%-60px))]">
            <h1 className="text-4xl font-medium py-2 mb-4 bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent inline-block">
              <img
                src="/pokeicon.png"
                className="h-[4rem] w-[4rem] inline mr-3 pb-1 px-1"
              />
              {name[0].toUpperCase() + name.substring(1)}
            </h1>
            <h1 className="">
              Done?{" "}
              <Link
                to="/dashboard/market"
                className="bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent cursor-pointer"
              >
                Go to the market
              </Link>
            </h1>
            <div className="w-full mt-5">
              {data ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <div>
                    <div className="border-2 border-outline rounded-md flex flex-col items-center relative h-[200px] w-[200px] md:h-[400px] md:w-[400px] overflow-hidden p-2 bg-gradient-to-tr from-outline via-white to-white">
                      <h1 className="absolute top-1 left-1 text-xl text-outline">
                        {name}
                      </h1>
                      <div className="flex-1 w-full relative">
                        <img
                          src={data.pokemon.api_data.sprite}
                          className="w-full h-full"
                          style={{ imageRendering: "pixelated" }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 my-4">
                      {data.pokemon.api_data.types.map((type) => {
                        return <Type key={type} name={type} />;
                      })}
                    </div>
                    <div className="flex-col gap-[2px] flex-1 flex sm:hidden my-10">
                      <Stats data={data.pokemon} />
                    </div>
                    <div className="flex flex-col gap-4">
                      {data && (
                        <>
                          <div className="flex items-center gap-2 w-full px-2 select-none text-xl">
                            <h1 className=" bg-gradient-to-tr from-primary via-secondary to-secondary rounded-full text-center w-[4rem] h-[4rem] pt-[3px] flex items-center justify-center text-2xl text-white">
                              {data.pokemon.owner_user.username[0].toUpperCase()}
                            </h1>
                            <div>
                              <h1>{data.pokemon.owner_user.username}</h1>
                              <h1 className="ml-auto text-green-400">
                                ${data.price}
                              </h1>
                            </div>
                          </div>
                          <div className="flex gap-2 w-full">
                            <Button
                              text="Purchase"
                              type="button"
                              className="flex-1"
                              onClick={handlePurchaseClick}
                            />
                            <Button
                              text="Counter Offer"
                              type="button"
                              className="flex-1"
                              appearance="cancel"
                              onClick={handleCounterClick}
                            />
                          </div>
                          {error && <h1 className="text-primary text-lg px-4">{error}</h1>}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="w-full hidden sm:block">
                    <Stats data={data.pokemon} />
                  </div>
                </div>
              ) : (
                <div className="border-2 border-outline rounded-md flex flex-col items-center relative h-[200px] w-[200px] md:h-[400px] md:w-[400px] overflow-hidden p-2 bg-gradient-to-tr from-outline via-white to-white">
                  <h1 className="absolute top-1 left-1 text-xl text-outline">
                    Loading
                  </h1>
                  <div></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
