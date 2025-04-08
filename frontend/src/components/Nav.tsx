export default function Nav() {
  return (
    <nav className="w-[100vw] sticky top-0 z-10">
      <div className="w-full h-[4rem] z-20 font-medium">
        {/* <div className="absolute flex justify-center w-full top-0 h-[calc(4rem+20px)] pointer-events-none overflow-hidden">
          <div
            className="top-0 w-[calc(100vw+100px)] flex-none h-[4rem]"
            style={{ boxShadow: "0px 4px 20px -10px black" }}
          />
        </div> */}
        <div className="w-full h-full flex items-center justify-between px-3 bg-white">
          <h1>Poke Trade</h1>
          <h1>Login</h1>
        </div>
      </div>
    </nav>
  );
}
