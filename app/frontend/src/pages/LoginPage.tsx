"use client"; // 이벤트를 처리하기 위해 클라이언트 컴포넌트로 지정

import { GalleryVerticalEnd, ArrowLeft } from "lucide-react"; // ArrowLeft 아이콘 추가
import { LoginForm } from "@/components/auth/login-form";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className='bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 relative'>
      <button
        onClick={() => navigate(`/`)}
        className='absolute top-6 left-6 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors'
      >
        <ArrowLeft className='size-4' />
        HOME
      </button>

      <div className='flex w-full max-w-sm flex-col gap-6'>
        <a href='#' className='flex items-center gap-2 self-center font-medium'>
          <div className='bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md'>
            <GalleryVerticalEnd className='size-4' />
          </div>
          Linkchain
        </a>
        <LoginForm />
      </div>
    </div>
  );
}
