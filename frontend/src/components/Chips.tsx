type props = {
  words: string[];
  className: string;
};

export default function Chips({ words, className }: props) {
  return (
    <div className={`flex flex-wrap gap-4 justify-center  ${className}`}>
      {words.map((word) => (
        <div
          key={word}
          className="bg-gradient-to-t from-primary to-secondary p-[3px] rounded-full"
        // className="border-2 border-tertiary rounded-full"
        >
          <div className="bg-white rounded-full px-10 py-2 font-bold">
            <div className="bg-gradient-to-b from-primary to-secondary bg-clip-text text-transparent">
              {word}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
