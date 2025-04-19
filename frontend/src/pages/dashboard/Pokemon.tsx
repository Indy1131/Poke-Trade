import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Type from "../../components/Type";
import { Name } from "../../components/Type";
import Button from "../../components/form/Button";
import Input from "../../components/form/Input";
import Stats from "../../components/Stats";

const BASE_URL = import.meta.env.VITE_BASE_URL;

type Pokemon = {
  api_data: {
    sprite: string;
    name: string;
    stats: { [key: string]: number };
    types: Name[];
  };
  listing_price: number | null;
  listing_id: number | null;
  id: number;
  owner_user: number;
  poke_dex_id: number;
};

export default function Pokemon({
  fromMarket,
  poke_id,
}: {
  fromMarket?: boolean;
  poke_id?: number;
}) {
  const { token } = useAuth();
  const params_id = useParams().id;
  const [data, setData] = useState<Pokemon | null>(null);
  const [formData, setFormData] = useState({ price: 0 });
  const [editingListing, setEditingListing] = useState(false);
  const navigate = useNavigate();

  const id = poke_id ? poke_id : params_id;

  function handleListingClick() {
    setEditingListing(true);
  }

  function handleCancelClick() {
    setEditingListing(false);
  }

  async function handleDeleteClick() {
    if (!data || !data.listing_id) return;

    await fetch(`${BASE_URL}/api/trade/listings/${data.listing_id}/delete/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    navigate(fromMarket ? "/dashboard/market" : "/dashboard");
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleCreateSubmit() {
    if (formData.price == 0) return;

    await fetch(`${BASE_URL}/api/trade/create_listing/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        pokemon: id,
        price: formData.price,
      }),
    });
  }

  async function handleEditSubmit() {
    if (!data || !data.listing_id || formData.price == 0) return;

    await fetch(`${BASE_URL}/api/trade/listings/${data.listing_id}/edit/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        price: formData.price,
      }),
    });
  }

  useEffect(() => {
    async function getData() {
      const response = await fetch(`${BASE_URL}/api/pokemon/${id}/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await response.json();
      setData(json);

      if (json.listing_price) setFormData({ price: json.listing_price });
    }

    getData();
  }, [id, token]);

  const name = data
    ? data.api_data.name[0].toUpperCase() + data.api_data.name.substring(1)
    : "Undefined";

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
              {name}
            </h1>
            <h1 className="">
              Done?{" "}
              <Link
                to={fromMarket ? "/dashboard/market" : "/dashboard"}
                className="bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent cursor-pointer"
              >
                {fromMarket ? "Go to the market" : "Go to my collection"}
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
                          src={data.api_data.sprite}
                          className="w-full h-full"
                          style={{ imageRendering: "pixelated" }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 my-4">
                      {data.api_data.types.map((type) => {
                        return <Type key={type} name={type} />;
                      })}
                    </div>
                    <div className="flex-col gap-[2px] flex-1 flex sm:hidden my-10">
                      <Stats data={data} />
                    </div>
                    <div className="flex flex-col gap-4">
                      {data.listing_price ? (
                        <>
                          {editingListing ? (
                            <>
                              <h1>Editing Listing</h1>
                              <form
                                className="w-full"
                                onSubmit={handleEditSubmit}
                              >
                                <Input
                                  type="number"
                                  name="price"
                                  label="Price"
                                  value={formData.price}
                                  onChange={handleChange}
                                />
                                <Button text="Submit" className="w-full mb-4" />
                                <div className="flex gap-2">
                                  <Button
                                    text="Unlist"
                                    type="button"
                                    className="flex-1"
                                    appearance="cancel"
                                    onClick={handleDeleteClick}
                                  />
                                  <Button
                                    text="Cancel"
                                    type="button"
                                    className="flex-1"
                                    appearance="cancel"
                                    onClick={handleCancelClick}
                                  />
                                </div>
                              </form>
                            </>
                          ) : (
                            <>
                              <h1>
                                Listed for{" "}
                                <span className="text-xl text-green-400">
                                  ${data.listing_price}
                                </span>
                              </h1>
                              <Button
                                text="Edit Listing"
                                onClick={handleListingClick}
                              />
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          {editingListing ? (
                            <>
                              <h1>Create Listing</h1>
                              <form
                                className="w-full"
                                onSubmit={handleCreateSubmit}
                              >
                                <Input
                                  type="number"
                                  name="price"
                                  label="Price"
                                  value={formData.price}
                                  onChange={handleChange}
                                />
                                <div className="flex gap-2">
                                  <Button text="List" className="flex-1" />
                                  <Button
                                    text="Cancel"
                                    type="button"
                                    className="flex-1"
                                    appearance="cancel"
                                    onClick={handleCancelClick}
                                  />
                                </div>
                              </form>
                            </>
                          ) : (
                            <>
                              <h1>This Pokemon is currently not listed.</h1>
                              <Button
                                text="Create Listing"
                                onClick={handleListingClick}
                              />
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="w-full hidden sm:block">
                    <Stats data={data} />
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
