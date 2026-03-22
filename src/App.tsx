import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/storage/User";
import { toast } from "sonner";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export function App() {

  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);

  const isUserLoggedIn = () => {
    if (user) {
      navigate("/ai-calendar")
    } else {
      toast.error("로그인 후 이용할 수 있습니다.");
      return;
    }
  }

  return (
    <div className="flex justify-center items-center min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">Project ready!</h1>
          <p>You may now add components and start building.</p>
          <p>We&apos;ve already added the button component for you.</p>
          <Button className="mt-2" onClick={isUserLoggedIn}>Button</Button>
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          (Press <kbd>d</kbd> to toggle dark mode)
        </div>
      </div>
      <div>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={[
            { title: "여행", date: "2026-05-01", 위도: "123", 경도: "123", text: "AI 설명 내용" },
            { title: "해운대", date: "2026-05-01", 위도: "123", 경도: "12312", text: "qweqweqwe" },
          ]}
        />
      </div>
    </div>
  )
}

export default App
