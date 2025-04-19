import { useAuth } from "../../hooks/useAuth";
import PokeCard from "./PokeCard";

type Pokemon = {
  api_data: {
    sprite: string;
    name: string;
    stats: { [key: string]: number };
  };
  id: number;
  owner_user: number;
  poke_dex_id: number;
};

type Listing = {
  id: number;
  pokemon: Pokemon;
  price: number;
};

export default function Listing({ listing }: { listing?: Listing }) {
  const { user } = useAuth();

  if (!listing)
    return (
      <div className="flex flex-col items-center aspect-square w-full h-full">
        <PokeCard />
      </div>
    );

  const listing_user = listing.pokemon.owner_user;

  return (
    <div className="flex flex-col items-center aspect-square w-full h-full mb-6">
      <PokeCard pokemon={listing.pokemon} listing_id={listing.id} />
      <div className="w-full mt-[4px]">
        <div className="flex items-center gap-2 w-[200px] px-2 select-none">
          <h1 className=" bg-gradient-to-tr from-primary via-secondary to-secondary rounded-full text-center w-[2.5rem] h-[2.5rem] pt-[2px] flex items-center justify-center text-xl text-white">
            {listing_user.username[0].toUpperCase()}
          </h1>
          <div>
            <h1 className="text-xs">{listing_user.username}</h1>
            <h1 className="ml-auto text-green-400 text-xs">${listing.price}</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
