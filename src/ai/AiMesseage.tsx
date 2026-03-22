import { type Message } from "@/storage/ChatSession";

type MessageProps = {
  message: Message;
};

export function AiMessage({ message }: MessageProps) {
  return (
    <div className="mr-auto bg-white border p-4 rounded-lg shadow-sm max-w-[80%]">
      <h4 className="font-semibold mb-1">{message.planName}</h4>
      <p>{message.planContent}</p>
      <p className="text-xs text-gray-400 mt-1">{message.planDate}</p>

      {message.planPlaces.map((place, index) => (
        <div key={index} className="mt-3 border-t pt-2">
          <p className="font-medium">{place.title}</p>
          <p className="text-sm">{place.description}</p>
          <p className="text-xs text-gray-400">
            {place.date} | {place.time}
          </p>
          <p className="text-xs text-gray-400">
            위도: {place.latitude}, 경도: {place.longitude}
          </p>
        </div>
      ))}
    </div>
  );
}