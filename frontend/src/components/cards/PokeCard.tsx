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
    <Link to={`/dashboard/pokemon/${pokemon.id}`}>
      <div className="bg-gradient-to-t from-white to-secondary rounded-xl p-10 flex flex-col items-center">
        <div className="h-[200px] w-[200px]">
          <img src="/groudon.png" className="w-full h-auto object-cover" />
        </div>
        <h1 className="text-2xl">{pokemon.name}</h1>
      </div>
    </Link>
  );
}
