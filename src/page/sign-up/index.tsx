import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldGroup, FieldLabel, FieldSet, Input } from "@/components/ui/index";
import { useAuthStore } from "@/storage/User";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";

//로그인 스키마 정의 (email 형식 및 비밀번호 자릿수 확인)
const formSchema = z.object({
  email: z.string().email("올바른 형식의 이메일 주소를 입력해주세요."),
  password: z.string().min(8, "비밀번호는 최소 8자 이상이어야 합니다."),
  confirmPassword: z.string().min(8, "비밀번호 확인을 입력해주세요."),
})
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof formSchema>;

function SignUp() {
  const navigate = useNavigate();

  const setUser = useAuthStore((state) => state.setUser);

  //form 객체 생성
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    //페이지에 들어올때마다 필드값 초기화
    form.reset({
      email: "",
      password: "",
    });
  }, []);

  //검증 성공 시 실행 함수
  const onValid = (data: SignUpFormValues) => {

    //////////////////////////////////////////////////////////////
    //임시 테스트용(아직 DB에서 데이터를 못 받아오기 때문에 상태 저장)
    setUser(
      { email: data.email }
    );

    toast.success("회원가입을 성공하셨습니다.");
    navigate("/sign-in");
  };

  return (
    <div className="flex flex-col justify-center items-center w-full min-h-screen">
      <form onSubmit={form.handleSubmit(onValid)} className="w-full max-w-xs">
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
                <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
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
                <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
              )}
            </Field>

            {/* 비밀번호 확인 필드 */}
            <Field>
              <FieldLabel htmlFor="confirmPassword">비밀번호 확인</FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="비밀번호 확인을 입력하세요."
                {...form.register("confirmPassword")}
              />
              {form.formState.errors.confirmPassword && (
                <p className="text-sm text-red-500">{form.formState.errors.confirmPassword.message}</p>
              )}
            </Field>
          </FieldGroup>

          <button type="submit" className="mt-4 w-full bg-blue-600 text-white p-2 rounded">
            회원가입
          </button>
        </FieldSet>
      </form>
    </div>
  );
}

export default SignUp;