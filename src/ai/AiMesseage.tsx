import { type Message } from "@/storage/ChatSession";
import { getGroupedAndSortedPlaces } from "@/lib/utils"; // 1. 유틸리티 함수 임포트

type MessageProps = {
  message: Message;
};

export function AiMessage({ message }: MessageProps) {
  // 2. 공통 함수를 사용하여 정렬된 날짜와 그룹화된 데이터를 가져옵니다.
  const { sortedDates, groupedPlaces } = getGroupedAndSortedPlaces(message.planPlaces);

  return (
    <div className="mr-auto bg-white border p-4 rounded-lg shadow-sm max-w-[80%]">
      <h4 className="font-semibold mb-1">{message.planName}</h4>
      <p className="whitespace-pre-wrap">{message.planContent}</p>
      <p className="text-xs text-gray-400 mt-1">{message.planDate}</p>

      {/* 3. 정렬된 날짜 배열을 순회하며 출력 */}
      {sortedDates.map((date) => (
        <div key={date} className="mt-4">
          <p className="font-bold text-primary">{date}</p>

          {/* 해당 날짜(date)에 속한 이미 정렬된 장소 리스트 출력 */}
          {groupedPlaces[date].map((place, index) => (
            <div key={index} className="mt-2 border-t pt-2 first:border-t-0">
              <p className="font-medium text-gray-800">{place.title}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{place.description}</p>
              <div className="flex gap-2 mt-1">
                 <p className="text-xs text-blue-500 font-medium">
                   🕒 {place.time}
                 </p>
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5">
                위도: {place.latitude}, 경도: {place.longitude}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}