import { JoinForm } from "@components/auth/join-form.tsx";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export const JoinPage = () => {
  const navigate = useNavigate();

  return (
    <div className='bg-muted relative flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
      <button
        onClick={() => navigate(`/`)}
        className='absolute top-6 left-6 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors'
      >
        <ArrowLeft className='size-4' />
        HOME
      </button>

      <div className='w-full max-w-sm'>
        <JoinForm />
      </div>
    </div>
  );
};

export default JoinPage;
