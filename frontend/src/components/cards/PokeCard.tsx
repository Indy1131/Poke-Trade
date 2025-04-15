import { Link } from "react-router-dom";

type Props = {
  pokemon?: Pokemon;
};

type Pokemon = {
  api_data: { sprite: string; name: string; types: string[] };
  id: number;
  owner_user: number;
  poke_dex_id: number;
};

export default function PokeCard({ pokemon }: Props) {
  if (!pokemon) {
    return (
      <div className="flex justify-center transition-all duration-75 ease-out items-center w-[210px] h-[210px] p-[5px] hover:p-0">
        <div className="border-2 border-outline rounded-md flex flex-col items-center relative h-full w-full overflow-hidden p-2 bg-gradient-to-tr from-outline via-white to-white">
          <h1 className="absolute top-1 left-1 text-xl text-outline">
            Loading
          </h1>
        </div>
      </div>
    );
  }

  return (
    <Link
      to={`/dashboard/pokemon/${pokemon.id}`}
      className="flex justify-center transition-all duration-75 ease-out items-center aspect-square hover:p-0 p-2"
    >
      <div className="border-2 border-outline rounded-md flex flex-col items-center relative h-full w-full overflow-hidden p-2 bg-gradient-to-tr from-outline via-white to-white">
        <h1 className="absolute top-1 left-1 text-xl text-outline">
          {pokemon.api_data.name[0].toUpperCase() +
            pokemon.api_data.name.substring(1)}
        </h1>
        <div className="flex-1 w-full relative">
          <img
            src={pokemon.api_data.sprite}
            className="object-cover w-full h-full bg-gradient-to-tr"
            style={{ imageRendering: "pixelated" }}
          />
        </div>
      </div>
    </Link>
  );
}
