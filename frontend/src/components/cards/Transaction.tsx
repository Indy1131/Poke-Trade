import { useAuth } from "../../hooks/useAuth";

export default function Transaction({ transaction }) {
  const { user } = useAuth();

  if (!transaction || !user)
    return (
      <div
        className="w-full max-w-[800px] rounded-md border-2 border-outline bg-gradient-to-tr from-outline via-white to-white text-outline h-[150px]"
        style={{ boxShadow: "0 0px 6px 0px #ECB5BC" }}
      >
        <h1 className="px-3 py-3 text-lg">Loading</h1>
      </div>
    );

  return (
    <div
      className="w-full max-w-[800px] rounded-md border-2 border-outline bg-gradient-to-tr from-outline via-white to-white text-outline p-2"
      style={{ boxShadow: "0 0px 6px 0px #ECB5BC" }}
    >
      {transaction.type == "listing" ? (
        <div className="flex gap-2">
          <div className="border-2 border-outline rounded-md flex flex-col items-center relative h-[200px] w-[200px] overflow-hidden p-2 bg-gradient-to-tr from-outline via-white to-white">
            <h1
              className={`absolute top-1 left-1 text-xl ${
                transaction.seller.id == user.id
                  ? "text-secondary"
                  : "text-green-400"
              }`}
            >
              {transaction.info.pokemon.api_data.name}
            </h1>
            <div className="flex-1 w-full relative">
              <img
                src={transaction.info.pokemon.api_data.sprite}
                className="w-full h-full"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
          </div>
          {transaction.seller.id == user.id ? (
            <div className="text-black p-2 flex flex-col">
              <h1 className="text-3xl">Sale</h1>
              <h2 className="text-lg">
                {transaction.buyer.username} purchased your listing
              </h2>
              <h2 className="text-3xl mt-auto text-green-400">
                ${transaction.info.price}
              </h2>
            </div>
          ) : (
            <div className="text-black p-2 flex flex-col">
              <h1 className="text-3xl">Purchase</h1>
              <h2 className="text-lg">
                You purchased {transaction.seller.username}'s listing
              </h2>
              <h2 className="text-3xl mt-auto text-secondary">
                ${transaction.info.price}
              </h2>
            </div>
          )}
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="border-2 border-outline rounded-md flex flex-col items-center relative h-[200px] w-[200px] overflow-hidden p-2 bg-gradient-to-tr from-outline via-white to-white">
            <h1
              className={`absolute top-1 left-1 text-xl ${
                transaction.seller.id == user.id
                  ? "text-green-400"
                  : "text-secondary"
              }`}
            >
              {transaction.info.offer.api_data.name}
            </h1>
            <div className="flex-1 w-full relative">
              <img
                src={transaction.info.offer.api_data.sprite}
                className="w-full h-full"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
          </div>
          <div className="border-2 border-outline rounded-md flex flex-col items-center relative h-[200px] w-[200px] overflow-hidden p-2 bg-gradient-to-tr from-outline via-white to-white">
            <h1
              className={`absolute top-1 left-1 text-xl ${
                transaction.seller.id == user.id
                  ? "text-secondary"
                  : "text-green-400"
              }`}
            >
              {transaction.info.original.api_data.name}
            </h1>
            <div className="flex-1 w-full relative">
              <img
                src={transaction.info.original.api_data.sprite}
                className="w-full h-full"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
          </div>
          {transaction.seller.id == user.id ? (
            <div className="text-black p-2 flex flex-col">
              <h1 className="text-xl">Incoming Trade Accepted</h1>
              <h2 className="text-lg">
                You traded your {transaction.info.original.api_data.name} for{" "}
                {transaction.buyer.username}'s{" "}
                {transaction.info.offer.api_data.name}
              </h2>
              <h2 className="text-xl mt-auto text-green-400">
                You accepted {transaction.buyer.username}'s trade
              </h2>
            </div>
          ) : (
            <div className="text-black p-2 flex flex-col">
              <h1 className="text-xl">Outgoing Trade Accepted</h1>
              <h2 className="text-lg">
                You traded your {transaction.info.offer.api_data.name} for{" "}
                {transaction.seller.username}'s{" "}
                {transaction.info.original.api_data.name}
              </h2>
              <h2 className="text-xl mt-auto text-green-400">
                {transaction.seller.username} accepted your trade
              </h2>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
