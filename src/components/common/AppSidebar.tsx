import { useNavigate } from "react-router-dom";
import { type ChatSession } from "@/storage/ChatSession";

interface AppSidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
}

function AppSidebar({ sessions, activeSessionId, onSelectSession }: AppSidebarProps) {
  const navigate = useNavigate();

  return (
    <aside className="w-full h-full max-h-[calc(100vh-120px)] flex flex-col gap-4 bg-gray-50 border rounded-2xl p-4 shadow-sm overflow-hidden">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between px-2 pt-2 shrink-0">
        <h2 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">
          PLAN History
        </h2>
        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
          {sessions.length}
        </span>
      </div>

      {/* 플랜 목록 */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300">
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-xs text-muted-foreground">새로운 플랜을 짜보세요.</p>
          </div>
        ) : (
          sessions.map((session) => {
            const isActive = activeSessionId === session.id;

            return (
              <button
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`w-full text-left p-3 text-sm border rounded-xl transition-all truncate group flex flex-col gap-1 
                  ${isActive
                    ? "bg-white border-primary shadow-sm ring-1 ring-primary/20"
                    : "bg-white hover:bg-slate-50 border-gray-100"
                  }`}
              >
                {/* 플랜 제목 */}
                <p className={`font-medium truncate ${isActive ? "text-primary" : "text-slate-700"}`}>
                  {session.title}
                </p>
                {/* 메시지 수 */}
                <span className="text-[10px] text-muted-foreground">
                  메시지 {session.messages.length}개
                </span>
              </button>
            );
          })
        )}
      </div>

      {/* 하단 새 플랜 버튼 */}
      <div className="pt-2 border-t shrink-0">
        <button
          onClick={() => navigate("/ai-calendar")}
          className="w-full py-2.5 text-sm font-semibold text-slate-600 hover:text-primary hover:bg-primary/5 border border-dashed border-slate-300 hover:border-primary rounded-xl transition-all"
        >
          + New Plan
        </button>
      </div>
    </aside>
  );
}

export default AppSidebar;