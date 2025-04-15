import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Type from "../../components/Type";
import { Name } from "../../components/Type";

const BASE_URL = import.meta.env.VITE_BASE_URL;

type Pokemon = {
  api_data: { sprite: string; name: string; types: Name[] };
  id: number;
  owner_user: number;
  poke_dex_id: number;
};

export default function Pokemon() {
  const { token } = useAuth();
  const { id } = useParams();
  const [data, setData] = useState<Pokemon | null>(null);

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
              Go back{" "}
              <Link
                to="/dashboard/"
                className="bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent"
              >
                home
              </Link>
            </h1>
            <div className="w-full mt-5">
              {data ? (
                <>
                  <div className="border-2 border-outline rounded-md flex flex-col items-center relative h-[400px] w-[400px] overflow-hidden p-2 bg-gradient-to-tr from-outline via-white to-white">
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
                    <div></div>
                  </div>
                  <div className="flex gap-2 my-4">
                    {data.api_data.types.map((type) => {
                      return <Type key={type} name={type} />;
                    })}
                  </div>
                </>
              ) : (
                <div className="border-2 border-outline rounded-md flex flex-col items-center relative h-[400px] w-[400px] overflow-hidden p-2 bg-gradient-to-tr from-outline via-white to-white">
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
