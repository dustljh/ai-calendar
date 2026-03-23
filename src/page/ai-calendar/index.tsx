import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CircleArrowUp } from "lucide-react";
import AppSidebar from "@/components/common/AppSidebar";
import { useChatStore } from "@/storage/ChatSession";
import { fetchAiResponse } from "@/ai/AiResponse";
import { toast } from "sonner";
import { AiMessage } from "@/ai/AiMesseage";
import { useAuthStore } from "@/storage/User";
import ItineraryMapSkeleton from "@/components/common/ItineraryMapSkeleton";

function AiCalendar() {
  //useChatStore의 메서드를 가져옴
  const { sessions, addSession, addMessageToSession } = useChatStore();

  // 동적 페이지 id 번호
  const { chatId } = useParams();

  //주소 이동
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState("");

  //채팅 생성 중 대기 
  const [isLoading, setIsLoading] = useState(false);

  //채팅 화면 자동 스크롤 변수
  const scrollRef = useRef<HTMLDivElement>(null);

  //user와 session의 유저 email을 구별하기 위함
  const user = useAuthStore((state) => state.user)
  const mySessions = sessions.filter(s => s.userId === user?.email);

  //session의 주소 id와 chatId의 같은 채팅을 찾음
  const currentSession = sessions.find((s) => s.id === chatId);
  const currentMessages = currentSession ? currentSession.messages : [];

  //currentMessages에 값이 들어올 때마다 자동 스크롤
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentMessages]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!user) {
      toast.warning("로그인이 필요한 서비스입니다.")
      return;
    }

    {/*입력받은 값(채팅)이 없거나 isLoding이 true일때 대기 */ }
    if (!inputValue.trim() || isLoading) {
      return;
    }

    const userMessage = {
      role: "user" as const,
      planName: null,
      planDate: null,
      planContent: inputValue,
      planPlaces: [],
    };

    const tempInput = inputValue;
    setInputValue("");
    setIsLoading(true);

    //주소창의 아이디 유무를 확인해서 새 세션과 기존 세션의 구분
    let targetId = chatId;

    if (!chatId) {
      // 1. 새 세션일 때 (객체 생성)
      targetId = Date.now().toString(); //날짜를 받음
      //새로운 객체를 생성하여 값을 넣어줌
      const newSession = {
        id: targetId,
        userId: user.email,
        title: tempInput.slice(0, 15),
        messages: [userMessage],
      };
      //값을 넣은 객체를 session에 추가
      addSession(newSession);
      navigate(`/ai-calendar/${targetId}`, { replace: true });
    } else {
      // 2. 기존 세션일 때 (작성한 메시지 추가)
      addMessageToSession(chatId, userMessage);
    }
    try {
      // AI 응답 호출 (현재까지의 메시지에 새 메시지 포함해서 전달)
      await fetchAiResponse(targetId!, [...currentMessages, userMessage]);
    } catch (error) {
      console.error("AI 에러:", error);
      toast.error(String(error));
    } finally {
      setIsLoading(false);
    }
  };

  //키보드 이벤트를 타입으로 받아옴
  //이러함으로써 enter와 shift+enter를 구분하여 입력
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <main className="mx-auto w-full h-screen max-w-[1328px] flex pt-20 p-6 gap-6 overflow-hidden">

      {/* 사이드바 */}
      <div className="hidden lg:block w-60 shrink-0 h-full">
        <AppSidebar
          sessions={mySessions}
          activeSessionId={chatId || null}
          onSelectSession={(id) => navigate(`/ai-calendar/${id}`)}
        />
      </div>

      {/* 세션 메인 화면 */}
      <section className={`flex-1 flex flex-col h-full ${!chatId ? "justify-center" : "justify-between"}`}>

        {/*chatId가 있을 때 출력*/}
        {chatId && (
          <div className="flex-1 flex flex-col min-h-0 border rounded-xl bg-card mb-4 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b bg-white/80 backdrop-blur-md flex justify-between items-center">

              {/*입력한 session의 제목을 보여줌*/}
              <h2 className="text-xl font-bold truncate">{currentSession?.title}</h2>
            </div>

            {/*ref를 사용하여 새 메시지가 추가되는 것을 감지면 scrollRef작동*/}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
              {/*지금까지 받은 모든 메시지를 출력*/}
              {currentMessages.map((msg, i) => msg.role === "user" ? (
                <div key={i} className={`max-w-[80%] p-4 rounded-lg shadow-sm ${msg.role === "user" ? "ml-auto bg-primary text-white" : "mr-auto bg-white border"}`}>
                  {msg.planContent}
                </div>
              ) : (
                <AiMessage key={i} message={msg} />
              ))}
              {/*isLoading이 true면 Ai의 답변을 기다림*/}
              {isLoading && (
                <div className="mr-auto bg-white border p-4 rounded-lg animate-pulse text-sm text-gray-400">
                  AI가 여행 계획을 짜는 중...
                </div>
              )}
            </div>
          </div>
        )}

        {/*머리글 chatId가 없을 때만 출력*/}
        <div className={`w-full max-w-2xl mx-auto ${!chatId ? "scale-100" : "pb-4"}`}>
          {!chatId && (
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2">어디로 떠나고 싶으신가요?</h1>
              <p className="text-muted-foreground">목적지나 원하는 테마를 알려주세요.</p>
            </div>
          )}

          {/*사용자 채팅 입력창*/}
          <form onSubmit={handleSubmit} className="relative group">
            <textarea

              value={inputValue}
              //사용자가 입력한 채팅을 받아옴
              onChange={(e) => setInputValue(e.target.value)}

              //키 입력 감지
              onKeyDown={handleKeyDown}

              //isLoading이 true면 입력 금지
              disabled={isLoading}
              placeholder="제주도 3박 4일 일정 짜줘!"
              className="w-full min-h-[70px] p-4 pr-14 border-2 rounded-2xl focus:border-primary outline-none resize-none shadow-lg transition-all disabled:bg-gray-50"
            />
            <button
              type="submit"
              className="absolute right-4 bottom-4 p-2 bg-primary text-white rounded-full hover:bg-primary/90 disabled:bg-gray-300"

              //inputValue가 공백을 제거하고 isLoading이 true면 작동
              //단, inputValue가 비어있으면 비활성화
              disabled={!inputValue.trim() || isLoading}
            >
              <CircleArrowUp size={24} className={isLoading ? "animate-spin" : ""} />
            </button>
          </form>
        </div>
      </section>

      {chatId && (
        <section className="hidden md:flex flex-1 flex-col h-full min-w-0 pb-4 animate-in slide-in-from-right-8 fade-in duration-500">
          <div className="flex-1 rounded-xl overflow-hidden shadow-sm border bg-card w-full h-full">
            {/* 이전에 만든 지도를 여기에 쏙 넣습니다 */}
            <ItineraryMapSkeleton />
          </div>
        </section>
      )}
    </main>
  );
}

export default AiCalendar;