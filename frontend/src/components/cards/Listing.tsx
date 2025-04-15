import PokeCard from "./PokeCard";

export default function Listing() {
  return (
    <div className="flex flex-col items-center aspect-square">
      <PokeCard />
      <div className="w-full">
        <h1 className="text-sm text-green-400 px-2 pt-1">$100</h1>
      </div>
    </div>
  );
}