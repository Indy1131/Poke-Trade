const colors = [
  { value: 50, color: [255, 0, 0] },
  { value: 80, color: [255, 152, 2] },
  { value: 100, color: [255, 254, 3] },
  { value: 150, color: [0, 255, 43] },
  { value: 200, color: [0, 255, 255] },
];

function getColor(value: number) {
  value = Math.min(value, 200);

  let floor = 0;
  while (floor < colors.length - 1 && colors[floor + 1].value < value) {
    floor++;
  }

  const lower = colors[floor];
  const upper = colors[floor + 1];

  const range = upper.value - lower.value;
  const rel = (value - lower.value) / range;

  const interpolated = lower.color.map((c, i) =>
    Math.round(c + (upper.color[i] - c) * rel)
  );

  return interpolated;
}

export default function Stats({ data }) {
  if (!data) return <h1></h1>;

  return (
    <div className="flex flex-col gap-[2px]">
      {Object.keys(data.api_data.stats).map((stat) => {
        const value = data.api_data.stats[stat];
        const percent = Math.min(Math.floor((value / 200) * 100), 100);

        const color = getColor(value);

        return (
          <div className="flex gap-2 w-full" key={stat}>
            <div className="w-[100px]">
              <h1>{stat}</h1>
            </div>
            <div className="w-[30px] font-medium">{value}</div>
            <div className="flex-1">
              <div
                className="h-full rounded-sm overflow-hidden"
                style={{
                  width: percent + "%",
                  backgroundColor: `rgb(${color.join(",")})`,
                }}
              >
                <div className="w-full h-full bg-gradient-to-b from-white/40  to-transparent" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
