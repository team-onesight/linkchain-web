"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/ui-store";
import { Link2 } from "lucide-react";
import { toast } from "sonner";
import { useCreateLink } from "@/hooks/useLinks";
import { useNavigate } from "react-router-dom";

export const StickyAddLinkForm = () => {
  const scrollDir = useScrollDirection();
  const { isInputFocused, setInputFocused, setInputBlurred } = useUiStore();
  const { mutate: createLink, isPending: isCreatingLink } = useCreateLink();
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const url = formData.get("url");

    if (!url || typeof url !== "string") {
      toast.error("Please enter a valid URL.");
      return;
    }

    createLink(url, {
      onError: (error: Error) => {
        if (error.cause === 401) {
          toast.error("Login Required", {
            description: "Please log in to access feature !",
            position: "top-center",
          });
          navigate("/login");
          return;
        }
        toast.error("Failed to add link", {
          description: error.message || "Something went wrong.",
          position: "top-center",
        });
      },
    });
  };

  return (
    <div
      className={cn(
        "fixed left-1/2 -translate-x-1/2 z-10 w-[calc(100%-2rem)] max-w-[500px] p-3 bg-white shadow-xl rounded-xl border border-gray-200 transition-all duration-300",
        {
          "translate-y-[150%]": scrollDir === "down" && !isInputFocused,
          "translate-y-0": scrollDir === "up" || isInputFocused,
          "bottom-0": isInputFocused,
          "bottom-20": !isInputFocused,
        }
      )}
    >
      <form onSubmit={handleSubmit} className='flex items-center gap-2'>
        <Link2 className='h-5 w-5 text-gray-400' />
        <Input
          name='url'
          placeholder='https://...'
          className='grow rounded-lg'
          type='url'
          required
          onFocus={setInputFocused}
          onBlur={setInputBlurred}
          disabled={isCreatingLink}
        />
        <Button type='submit' className='shrink-0 rounded-lg' disabled={isCreatingLink}>
          Add Link
        </Button>
      </form>
    </div>
  );
};
