import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Field, FieldGroup, FieldLabel, FieldSet, Input } from "@/components/ui/index";
import { useAuthStore } from "@/storage/User";
import { useEffect } from "react";
import { toast } from "sonner";

//로그인 스키마 정의 (email 형식 및 비밀번호 자릿수 확인)
const formSchema = z.object({
  email: z.string().email("올바른 형식의 이메일 주소를 입력해주세요."),
  password: z.string().min(8, "비밀번호는 최소 8자 이상이어야 합니다."),
});

type LoginFormValues = z.infer<typeof formSchema>;

function SignIn() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const user = useAuthStore((state) => state.user);

  //form 객체 생성
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });


  useEffect(() => {
    //페이지에 들어올때마다 필드값 초기화
    form.reset({
      email: "",
      password: "",
    });
  }, []);

  //로그인 제출 함수
  const onValid = (data: LoginFormValues) => {
    /////////////////////////////////////////////////////////////////////////////////////////////
    //DB에서 값을 받아오면 넣을 값
    // if (data.email === DB에서 받아올 email && data.password === DB에서 받아올 password ) {
    if (data.email === user?.email) {
      setUser({ email: data.email });
      toast.success("로그인을 성공하였습니다.");
      navigate("/ai-calendar");
    } else {
      toast.error("입력하신 정보가 다릅니다.");
      return;
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onValid)}
      className="flex flex-col justify-center items-center w-full min-h-screen"
    >
      <div className="w-full max-w-xs">
        <FieldSet>
          <FieldGroup>
            {/* 이메일 필드 */}
            <Field>
              <FieldLabel htmlFor="email">이메일</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="이메일을 입력하세요."
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.email.message}
                </p>
              )}
            </Field>

            {/* 비밀번호 필드 */}
            <Field>
              <FieldLabel htmlFor="password">비밀번호</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요."
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.password.message}
                </p>
              )}
            </Field>
          </FieldGroup>

          <button
            type="submit"
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition-colors"
          >
            로그인
          </button>
        </FieldSet>
      </div>
    </form>
  );
}

export default SignIn;