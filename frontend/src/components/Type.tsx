const colors = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export type Name = keyof typeof colors;

export default function Type({ name }: { name: Name }) {
  const color = colors[name];

  return (
    <div
      className={`py-2 w-25 rounded-md text-center text-white border-2 border-outline`}
      style={{
        backgroundImage: `linear-gradient(to top right, ${color}, ${hexToRgba(
          color,
          0.4
        )})`,
      }}
    >
      {name}
    </div>
  );
}
