import { useNavigate } from "react-router-dom";

type Props = {
  pokemon?: Pokemon;
  listing_id?: number;
  onClick?: () => void;
  selected?: boolean;
};

type Pokemon = {
  api_data: { sprite: string; name: string; types: string[] };
  id: number;
  owner_user: number;
  poke_dex_id: number;
};

export default function PokeCard({
  pokemon,
  listing_id,
  onClick,
  selected,
}: Props) {
  const navigate = useNavigate();

  function handleRedirectClick() {
    if (onClick) {
      onClick();
      return;
    }

    if (!listing_id) {
      navigate(`/dashboard/pokemon/${pokemon.id}`);
    } else {
      navigate(`/dashboard/market/${listing_id}`);
    }
  }

  if (!pokemon) {
    return (
      <div className="flex justify-center transition-all duration-75 ease-out items-center aspect-square hover:p-0 p-2 h-full w-full">
        <div
          style={{ boxShadow: "0 0px 6px 0px #ECB5BC" }}
          className="border-2 border-outline rounded-md flex flex-col items-center relative h-full w-full overflow-hidden p-2 bg-gradient-to-tr from-outline via-white to-white"
        >
          <h1 className="absolute top-1 left-1 text-xl text-outline">
            Loading
          </h1>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleRedirectClick}
      className={`flex justify-center transition-[padding] duration-75 ease-out items-center p-2 aspect-square h-full w-full cursor-pointer ${
        !selected && "hover:p-0"
      }`}
    >
      <div
        style={{ boxShadow: "0 0px 6px 0px #ECB5BC" }}
        className={`border-outline rounded-md flex flex-col items-center relative h-full w-full overflow-hidden p-2 bg-gradient-to-tr from-outline via-white to-white ${
          selected ? "border-6" : "border-2"
        }`}
      >
        <h1 className="absolute top-1 left-1 text-xl text-outline">
          {pokemon.api_data.name[0].toUpperCase() +
            pokemon.api_data.name.substring(1)}
        </h1>
        <div className="flex-1 w-full relative">
          <img
            src={pokemon.api_data.sprite}
            className="object-cover w-full h-full bg-gradient-to-tr select-none"
            style={{ imageRendering: "pixelated" }}
          />
        </div>
      </div>
    </button>
  );
}
