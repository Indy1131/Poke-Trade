import PokeCard from "../../components/cards/PokeCard";

export default function Dashboard() {
  return (
    <>
      <form className="sticky top-0 z-20 bg-green-600">
        <input placeholder="search bar" />
      </form>
      <div
        className="grid grid-cols-2 gap-8 justify-center w-[min(calc(330px*4+40px*3),100%)]"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))",
        }}
      >
        <PokeCard />
        <PokeCard />
        <PokeCard />
        <PokeCard />
        <PokeCard />
        <PokeCard />
        <PokeCard />
        <PokeCard />
        <PokeCard />
        <PokeCard />
        <PokeCard />
        <PokeCard />
        <PokeCard />
        <PokeCard />
        <PokeCard />
        <PokeCard />
        <PokeCard />
        <PokeCard />
        <PokeCard />
        <PokeCard />
        <PokeCard />
        <PokeCard />
        <PokeCard />
        <PokeCard />
      </div>
    </>
  );
}
