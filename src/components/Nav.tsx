export default function Nav() {
  return (
    <nav className="w-[100vw]">
      <div className="sticky top-0  w-full text-black h-[4rem] z-20 bg-white">
        <div className="absolute flex justify-center w-full top-0 h-[calc(4rem+20px)] pointer-events-none overflow-hidden">
          <div
            className="top-0 w-[calc(100vw+100px)] flex-none h-[4rem]"
            style={{ boxShadow: "0px 4px 4px 0px black" }}
          />
        </div>
        <div className="w-full bg-amber-300 h-full flex items-center justify-between px-3">
          <h1>logo element</h1>
          <h1>Other logo</h1>
        </div>
      </div>
    </nav>
  );
}
