import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Aiplace {
  title: string; //해운대
  date: string; //날짜
  latitude: number; //위도
  longitude: number; //경도
  time:string; //16-18시
  description?: string; //장소에 대한 간단한 설명
}

export interface Message {
  role: "user" | "ai";
  planName: string | null; //"부산 3박 4일 여행 일정"
  planDate: string | null; //2026-01-01 ~ 2026-01-04
  planContent: string | null; //부산 여행 추천 일정을 만들어 드렸습니다
  planPlaces: Aiplace[];
}

export interface ChatSession {
  id: string; //채팅 주소 구별
  userId: string | null;
  title: string; //채팅 제목(첫 채팅기준)
  messages: Message[];
}

interface ChatStore {
  sessions: ChatSession[];
  addSession: (session: ChatSession) => void;  //채팅방 리스트 앞에 추가
  addMessageToSession: (sessionId: string, message: Message) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      sessions: [],
      addSession: (session) =>
        //새로운 세션을 기존 세션 앞에 추가(가장 최근 세션이 맨위로 올리기 위해)
        set((state) => ({ sessions: [session, ...state.sessions] })),

      addMessageToSession: (sessionId, message) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            //현재 보고자하는 페이지의 id가 같은지 확인
            s.id === sessionId
              //새로운 메시지를 기존 메시지 끝에 추가
              ? { ...s, messages: [...s.messages, message] }
              : s
          ),
        })),
    }),
    {
      name: "chat-storage",
    }
  )
);