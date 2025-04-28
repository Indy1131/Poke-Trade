import { useNavigate } from "react-router-dom";
import Button from "../form/Button";
import { useAuth } from "../../hooks/useAuth";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Trade({ trade, inbound }) {
  const { token } = useAuth();
  const navigate = useNavigate();

  async function handleCancelClick() {
    await fetch(`${BASE_URL}/api/trade/cancel/${trade.id}/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    navigate(0);
  }

  async function handleAcceptClick() {
    await fetch(`${BASE_URL}/api/trade/accept/${trade.id}/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    navigate(0);
  }

  const original = (
    <div>
      <h1>
        {!inbound && trade ? `${trade.original.owner_user.username}'s` : "Your"}
      </h1>
      <div className="border-2 border-outline rounded-md flex flex-col items-center relative h-[120px] w-[120px] sm:h-[200px] sm:w-[200px] overflow-hidden p-2 bg-gradient-to-tr from-outline via-white to-white">
        <h1 className="absolute top-1 left-1 text-xl text-outline">
          {trade ? trade.original.api_data.name : "Loading"}
        </h1>
        <div className="flex-1 w-full relative">
          {trade && (
            <img
              src={trade.original.api_data.sprite}
              className="w-full h-full"
              style={{ imageRendering: "pixelated" }}
            />
          )}
        </div>
      </div>
    </div>
  );

  const offer = (
    <div>
      <h1>
        {inbound && trade ? `${trade.offer.owner_user.username}'s` : "Your"}
      </h1>
      <div className="border-2 border-outline rounded-md flex flex-col items-center relative h-[120px] w-[120px] sm:h-[200px] sm:w-[200px] overflow-hidden p-2 bg-gradient-to-tr from-outline via-white to-white">
        <h1 className="absolute top-1 left-1 text-xl text-outline">
          {trade ? trade.offer.api_data.name : "Loading"}
        </h1>
        <div className="flex-1 w-full relative">
          {trade && (
            <img
              src={trade.offer.api_data.sprite}
              className="w-full h-full"
              style={{ imageRendering: "pixelated" }}
            />
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="w-full sm:max-w-[600px] rounded-md p-2 border-2 border-outline bg-gradient-to-tr from-outline via-white to-white"
      style={{ boxShadow: "0 0px 6px 0px #ECB5BC" }}
    >
      <div className="flex justify-between items-stretch">
        {offer}
        <div className="flex items-center sm:text-3xl mx-6">
          <h1>For</h1>
        </div>
        {original}
      </div>
      {inbound ? (
        <div className="flex gap-2">
          <Button
            text="Accept"
            onClick={handleAcceptClick}
            className="w-full my-4"
          />
          <Button
            text="Reject"
            appearance="cancel"
            onClick={handleCancelClick}
            className="w-full my-4"
          />
        </div>
      ) : (
        <Button
          text="Cancel"
          onClick={handleCancelClick}
          className="w-full my-4"
        />
      )}
    </div>
  );
}
