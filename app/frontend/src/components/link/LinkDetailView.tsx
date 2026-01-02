import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Bookmark, ExternalLink, X} from "lucide-react";
import * as AspectRatio from "@radix-ui/react-aspect-ratio";
import {Input} from "@/components/ui/input";
import type {LinkItem} from "@/model/link/type";
import {toast} from "sonner";

interface LinkDetailViewProps {
  link: LinkItem;
}

export function LinkDetailView({link}: LinkDetailViewProps) {
  const [currentTags, setCurrentTags] = useState<string[]>(link.tags.map((tag) => tag.tag_name));

  const handleBookmark = () => {
    toast("is bookmarked", {
      description: "The link has been added to your bookmarks.",
      position: "top-center",
      action: {
        label: "Undo",

        onClick: () => console.log("Undo"),
      },
    });
  };

  const handleAddTag = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newTag = (e.currentTarget.elements.namedItem("newTag") as HTMLInputElement).value;
    if (newTag && !currentTags.includes(newTag)) {
      setCurrentTags([...currentTags, newTag]);
      e.currentTarget.reset();
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setCurrentTags(currentTags.filter((tag) => tag !== tagToDelete));
  };

  return (
    <div className='mx-auto'>
      <h1 className='text-3xl md:text-4xl font-bold mb-4'>{link.title}</h1>

      <div className='flex items-center gap-4 mb-6 text-muted-foreground text-sm'>
        <a
          href={link.url}
          target='_blank'
          rel='noopener noreferrer'
          className='truncate underline underline-offset-2 hover:text-primary'
        >
          {link.url}
        </a>
        <div className='flex items-center gap-2 ml-auto mr-1'>
          <Button variant='outline' size='icon' className='h-8 w-8' onClick={handleBookmark}>
            <Bookmark className='h-4 w-4'/>
          </Button>
          <a href={link.url} target='_blank' rel='noopener noreferrer'>
            <Button variant='outline' size='icon' className='h-8 w-8'>
              <ExternalLink className='h-4 w-4'/>
            </Button>
          </a>
        </div>
      </div>

      <p className='text-base text-gray-700 mb-6'>{link.description}</p>

      <div className='space-y-4 mb-8'>
        <h3 className='text-sm font-semibold text-muted-foreground'>TAGS</h3>
        <div className='flex flex-wrap gap-2'>
          {currentTags.map((tag) => (
            <Badge key={tag} variant='secondary' className='pl-3 pr-1 py-1 text-sm'>
              {tag}
              <button
                onClick={() => handleDeleteTag(tag)}
                className='ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-muted-foreground/20 p-0.5'
              >
                <X className='h-3 w-3'/>
                <span className='sr-only'>Remove {tag}</span>
              </button>
            </Badge>
          ))}
        </div>
        <form onSubmit={handleAddTag} className='flex items-center gap-2'>
          <Input name='newTag' placeholder='Add a new tag...' className='h-8'/>
          <Button type='submit' size='sm'>
            Add
          </Button>
        </form>
      </div>

      <AspectRatio.Root ratio={16 / 9} className='bg-muted rounded-lg border'>
        <iframe
          src={link.url}
          className='w-full h-full rounded-lg'
          title={link.title}
          sandbox='allow-scripts allow-same-origin'
        />
      </AspectRatio.Root>
      <p className='text-xs text-center text-muted-foreground mt-2'>
        Note: Some websites may not be available for preview.
      </p>
    </div>
  );
}
