import { JoinForm } from "@components/auth/join-form.tsx";

export const JoinPage = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <JoinForm />
      </div>
    </div>
  );
};

export default JoinPage;
