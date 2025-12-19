import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";


export const JoinForm = ({ ...props }: React.ComponentProps<typeof Card>) => {
  const [_, setHasError] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const handleSubmit = async () => {

    if (username.trim().length < 1) {
      toast.error("아이디를 입력해주세요.", {
        position: "top-center",
      });
      setHasError(true);
      return;
    }

    if (password.trim().length < 1) {
      toast.error("비밀번호를 입력해주세요.", {
        position: "top-center",
      });
      setHasError(true);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("비밀번호가 일치하지 않습니다.", {
        position: "top-center",
      });
      setHasError(true);
      return;
    }

    const response = await fetch("/api/v1/auth/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });


    if (response.ok) {
      alert(`회원가입 성공!`);
      window.location.href = "/login";
    } else {
      const data = await response.json();

      setHasError(true);
      toast.error(`회원가입 실패: ${data.detail}`, {
        position: "top-center",
      });

    }
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Enter your information below to create your account</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="username">ID</FieldLabel>
            <Input id="username" type="text" placeholder="사용자 아이디를 입력해주세요"
                   value={username}
                   onChange={(e) => setUsername(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input id="password" type="password" placeholder="비밀번호를 입력해주세요."
                   value={password}
                   onChange={(e) => setPassword(e.target.value)} />
            {/*<FieldDescription>Must be at least 8 characters long.</FieldDescription>*/}
          </Field>
          <Field>
            <FieldLabel htmlFor="confirm-password"
            >Confirm Password</FieldLabel>
            <Input id="confirm-password" type="password" value={confirmPassword} placeholder="비밀번호를 다시 한 번 입력해주세요."
                   onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Field>
          <FieldGroup>
            <Field>
              <Button type="button" onClick={() => handleSubmit()}>Create Account</Button>
              <FieldDescription className="px-6 text-center">
                Already have an account? <a href="/login">Sign in</a>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </FieldGroup>
      </CardContent>
    </Card>
  );
};
