import Card from "../components/Card";
import Chips from "../components/Chips";
import InfiniteCarousel from "../components/InfiniteCarousel";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center relative">
      <h1 className="mt-40 mb-5  text-4xl sm:text-7xl font-medium bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent">
        Gotta catch 'em all.
      </h1>
      <h2 className="text-xl sm:text-3xl mb-15">The best platform for Pokemon fans.</h2>
      <div className="w-full flex justify-center">
        <InfiniteCarousel className="w-[min(800px,100%)]">
          <img src="/diamond.webp" className="h-[100px] w-auto px-5" />
          <img src="/pearl.webp" className="h-[100px] w-auto px-5" />
          <img src="/heartgold.webp" className="h-[100px] w-auto px-5" />
          <img src="/ss.webp" className="h-[100px] w-auto px-5" />
          <img src="/black.webp" className="h-[100px] w-auto px-5" />
          <img src="/white.webp" className="h-[100px] w-auto px-5" />
          <img src="/x.webp" className="h-[100px] w-auto px-5" />
          <img src="/y.webp" className="h-[100px] w-auto px-5" />
          <img src="/oras.webp" className="h-[100px] w-auto px-5" />
          <img src="/as.webp" className="h-[100px] w-auto px-5" />
          <img src="/sun.webp" className="h-[100px] w-auto px-5" />
          <img src="/moon.webp" className="h-[100px] w-auto px-5" />
        </InfiniteCarousel>
      </div>
      <div className="flex flex-col items-center mb-10">
        <div className="sticky top-[100px] pt-[200px] mt-20 flex justify-center overflow-hidden w-full sm:w-auto">
          <img
            src="/groudon.png"
            className="w-full min-w-[700px] absolute top-0 z-1"
          />
          <div className="bg-gradient-to-b from-secondary to-primary w-[min(calc(100vw-60px),1000px)] h-[600px] rounded-t-3xl flex justify-center"></div>
          <div className="absolute w-full h-[600px] flex flex-col z-2 bottom-0">
            <div className="flex-1" />
            <div className="w-full h-[50%] bottom-0 bg-gradient-to-t from-white to-transparent" />
            <div className="w-full flex-1 bg-white" />
          </div>
        </div>
        <div className="w-[min(1000px,calc(100%-60px))]">
          <div className="grid grid-cols-2 gap-10 mt-20 sm:px-10">
            <Card className="flex-1">
              <h1 className="text-black text-2xl sm:text-4xl py-5 h-30">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Collect
                </span>{" "}
                your Pokemon.
              </h1>
              <p>
                We have over 1000 of your favorite Pokemon. Build your
                collection by catching them all!
              </p>
            </Card>
            <Card className="flex-1">
              <h1 className="text-black text-2xl sm:text-4xl  py-5 h-30">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Trade
                </span>{" "}
                your Pokemon.
              </h1>
              <p>
                Have a Pokemon you really want? Trade with your friends to add it to your collection!
              </p>
            </Card>
            <Card className="flex-1">
              <h1 className="text-black text-2xl sm:text-4xl  py-5 h-30">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Sell
                </span>{" "}
                your Pokemon.
              </h1>
              <p>
                Sell you Pokemon for Poke Dollars. Use Poke Dollars to purchase your favorite Pokemon!
              </p>
            </Card>
            <Card className="flex-1">
              <h1 className="text-black text-2xl sm:text-4xl py-5 h-30">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Socialize
                </span>{" "}
                with fans.
              </h1>
              <p>
                Socializie with Pokemon fans on one massive platform! Interact with other users through our market by trading and selling!
              </p>
            </Card>
          </div>
        </div>
      </div>
      <h1 className="mt-20 text-4xl sm:text-7xl pb-2 pt-2 font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
        Everything for you.
      </h1>
      <h2 className="text-2xl sm:text-3xl">Tons of features.</h2>
      <div className="flex flex-col items-center w-full bg-gradient-to-b from-primary to-secondary relative mb-10">
        <div className="absolute bg-gradient-to-b from-white to-transparent w-full h-[600px] top-0 z-0" />
        <div className="z-1 flex flex-col items-center bg-white rounded-t-xl mt-10 pb-20 w-[calc(100%-60px)]">
          <img src="/pokeball.png" className="w-[900px] mt-5" />
          <Chips
            className="sm:w-[760px]"
            words={[
              "Trade with friends",
              "List Pokemon",
              "Sell Pokemon",
              "Socialize with fans",
              "Meet new friends",
              "Collect them all",
              "View Pokemon stats",
              "Pokemon from every gen",
            ]}
          />
        </div>
        <div className="absolute bg-gradient-to-t from-white to-transparent w-full h-[100px] bottom-0 z-0" />
      </div>
      {/* <div className="relative flex flex-col mt-30">
        <div className="flex flex-col items-center mb-10">
          <div className="top-[100px] pt-[200px] mt-20 flex overflow-hidden">
            <img
              src="/magikarp.png"
              className="w-[600px] rotate-350 absolute top-0 z-1"
            />
            <div className="bg-gradient-to-b from-secondary to-primary w-[min(calc(100vw-60px),1200px)] h-[520px] rounded-t-3xl flex flex-col items-center justify-center">
              <h1 className="z-5 text-medium text-7xl mt-[100px] text-center px-2">
                Join our community <span className="text-tertiary">today.</span>
              </h1>
              <h2 className="z-5 text-5xl">Sign up</h2>
            </div>
            <div className="absolute w-full h-[600px] flex flex-col z-2 bottom-0">
              <div className="flex-1" />
              <div className="w-full h-[50%] bottom-0 bg-gradient-to-t from-white to-transparent" />
              <div className="w-full flex-1 bg-white" />
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}
