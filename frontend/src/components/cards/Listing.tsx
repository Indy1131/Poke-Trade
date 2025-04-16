import PokeCard from "./PokeCard";

export default function Listing() {
  return (
    <div className="flex flex-col items-center aspect-square w-full h-full">
      <PokeCard />
      <div className="w-full">
        <h1 className="absolute text-sm text-green-400 px-2 pt-1">$1000</h1>
      </div>
    </div>
  );
}