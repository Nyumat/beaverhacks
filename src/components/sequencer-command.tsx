import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { DeleteIcon, SaveIcon, ShareIcon } from 'lucide-react';
import React from 'react';

type Props = {
  toast: any;
  samples: { url: string; name: string | undefined }[];
  numOfSteps?: number;
  checkedSteps: string[];
  handleSaveClick: () => void;
  handleClearSessionClick: () => void;
};

export default function sequencorCommand({
  toast,
  samples,
  numOfSteps,
  checkedSteps,
  handleSaveClick,
  handleClearSessionClick,
}: Props) {
  const [open, setOpen] = React.useState(false);

  const handleSessionSave = async () => {
    try {
      handleSaveClick();
      setOpen(false);
    } catch (err) {}
  };

  const handleSessionDelete = async () => {
    try {
      handleClearSessionClick();
      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'j' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (open && e.key === 'b' && (e.metaKey || e.ctrlKey) && open) {
        e.preventDefault();
        handleSessionSave();
      }
      if (e.key === 'q' && (e.metaKey || e.ctrlKey) && open) {
        e.preventDefault();
        handleSessionDelete();
      }
      if (e.key === 'z' && (e.metaKey || e.ctrlKey) && open) {
        e.preventDefault();
        handleSessionDelete();
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open]);

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem onSelect={handleSessionSave}>
              <SaveIcon className="mr-2 h-4 w-4" />
              Save Session
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <ShareIcon className="mr-2 h-4 w-4" />
              Share Session
              <CommandShortcut>⌘Q</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={handleSessionDelete}>
              <DeleteIcon className="mr-2 h-4 w-4" />
              Delete Session
              <CommandShortcut>⌘Z</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </>
  );
}
