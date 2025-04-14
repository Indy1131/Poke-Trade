import { Link } from "react-router-dom";

type Props = {
  pokemon: Pokemon;
};

type Pokemon = {
  name: string;
  id: number;
};

export default function PokeCard({ pokemon }: Props) {
  return (
    <Link
      to={`/dashboard/pokemon/${pokemon.id}`}
      className="flex justify-center transition-all duration-75 ease-out items-center w-[210px] h-[210px] p-[5px] hover:p-0"
    >
      <div className="border-2 border-outline rounded-md flex flex-col p-2 items-center relative w-full h-full">
        <div className="flex-1 w-full relative">
          <div className="absolute bottom-0 left-0 bg-gradient-to-t from-white to-transparent w-full">
            <h1 className="text-md">{pokemon.name}</h1>
          </div>
          <img src="/groudon.png" className="w-full h-full object-cover" />
        </div>
      </div>
    </Link>
  );
}
