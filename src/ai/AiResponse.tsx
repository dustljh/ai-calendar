import { type Message } from "@/storage/ChatSession";
import { useChatStore } from "@/storage/ChatSession";

export const fetchAiResponse = async (id: string, messages: Message[]) => {
  //3초 동안 응답을 기다리는 비동기 코드
  await new Promise((res) => setTimeout(res, 3000));

  // 마지막 사용자 메시지 추출
  const lastUserMessage = messages[messages.length - 1]?.planContent;

  // AI 응답 객체 생성(예시)
  const aiMessage: Message = {
  role: "ai",
  planName: "부산 3박 4일 여행 일정",
  planDate: "2026-06-13 ~ 2026-06-17",
  planContent: `플랜 AI가 ${lastUserMessage}에 대해 추진 일정을 만들어드렸습니다.`,
  planPlaces: [
  {
    title: "해목 해운대점",
    date: "2026-06-14",
    latitude: 35.1617808,
    longitude: 129.1596666,
    time: "11:00-12:00",
    description: "생활의 달인에 출연한 나고야식 장어덮밥(히츠마부시) 전문점으로 해운대 필수 맛집입니다.",
  },
  {
    title: "자갈치시장 & 국제시장",
    date: "2026-06-14",
    latitude: 35.1023699,
    longitude: 129.0283644,
    time: "10:00-12:00",
    description: "부산의 활기를 그대로 느낄 수 있는 전통시장으로, 싱싱한 해산물과 먹자골목의 다양한 간식을 즐길 수 있습니다.",
  },
  {
    title: "금수복국 해운대본점",
    date: "2026-06-15",
    latitude: 35.1624205,
    longitude: 129.1645061,
    time: "10:00-12:00",
    description: "1970년부터 이어온 뚝배기 복국 원조집으로, 맑고 시원한 국물이 일품인 부산의 노포 맛집입니다.",
  },
  {
    title: "고짚 광안리점",
    date: "2026-06-16",
    latitude: 35.1513254,
    longitude: 129.1154937,
    time: "10:00-12:00",
    description: "짚불 향 가득한 우대갈비를 즐길 수 있는 곳으로, 광안리 해변 근처에서 든든한 식사가 가능합니다.",
  },
  {
    title: "흰여울문화마을",
    date: "2026-06-17",
    latitude: 35.0782798,
    longitude: 129.0453198,
    time: "10:00-12:00",
    description: "절벽 위 좁은 골목길과 푸른 바다가 어우러진 예술마을로, '부산의 산토리니'라 불리는 산책 명소입니다.",
  },
],
};

  //`AI 응답: ${lastUserMessage}에 대한 계획을 세워드릴게요!`,
  if (!aiMessage.planName || !aiMessage.planDate || !aiMessage.planContent || !aiMessage.planPlaces) {
    console.error("AI 메시지 필수 값 누락되었습니다.");
    return;
  }

  useChatStore.getState().addMessageToSession(id, aiMessage);
};