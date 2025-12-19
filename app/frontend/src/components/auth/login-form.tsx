import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store.ts";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { user, isAuthenticated, isLoading, login, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    await login(username, password);
  };


  useEffect(() => {
    if (isAuthenticated && user) {
      toast.success(`${user.username}님 환영합니다.`);
      navigate("/");
    }

  }, [isAuthenticated, navigate, user]);
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          {/*<CardDescription>Login with your Email</CardDescription>*/}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">ID</FieldLabel>
                <Input id="username" type="text" placeholder="아이디를 입력해주세요."
                       value={username}
                       onChange={(e) => setUsername(e.target.value)} required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input id="password" type="password" placeholder="비밀번호를 입력해주세요."
                       value={password}
                       onChange={(e) => setPassword(e.target.value)} required />
              </Field>
              <Field>
                <Button type="submit" disabled={isLoading}>{isLoading ? "로그인 중..." : "로그인"}</Button>
                {
                  error && (
                    <FieldDescription className="text-center text-red-600 mt-2">
                      {error}
                    </FieldDescription>
                  )
                }
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <a href="/join" className="underline-offset-4 hover:underline">
                    Sign up
                  </a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
