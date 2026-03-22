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
        title: "해운대",
        date: "2026-06-14",
        latitude: 35.1587,
        longitude: 129.1604,
        time: "10:00-12:00",
        description: "부산의 대표 해수욕장",
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