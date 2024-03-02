import React from 'react';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarShortcut,
  MenubarTrigger,
} from '@/components/ui/menubar';

type props = {
  handleStartClick: () => Promise<void>;
  handleSaveClick: () => Promise<void>;
  handleClearSessionClick: () => Promise<void>;
  clearSteps: () => void;
  setIsLayoutUnlocked: React.Dispatch<React.SetStateAction<boolean>>;
  isLayoutUnlocked: boolean;
};

export function SequencerMenu({
  handleStartClick,
  handleSaveClick,
  handleClearSessionClick,
  clearSteps,
  setIsLayoutUnlocked,
  isLayoutUnlocked,
}: props) {
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'p' && (e.metaKey || e.ctrlKey) && e.altKey) {
        e.preventDefault();
        handleStartClick();
      }
      if (e.key === 's' && (e.metaKey || e.ctrlKey) && e.altKey) {
        e.preventDefault();
        handleSaveClick();
      }
      if (e.key === 'c' && (e.metaKey || e.ctrlKey) && e.altKey) {
        e.preventDefault();
        clearSteps();
      }
      if (e.key === 'd' && (e.metaKey || e.ctrlKey) && e.altKey) {
        e.preventDefault();
        handleClearSessionClick();
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    handleStartClick,
    handleSaveClick,
    handleClearSessionClick,
    clearSteps,
    setIsLayoutUnlocked,
    isLayoutUnlocked,
  ]);

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onSelect={handleStartClick}>
            Play <MenubarShortcut>⌘ alt P</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onSelect={handleSaveClick}>
            Save Session <MenubarShortcut>⌘ alt S</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onSelect={clearSteps}>
            Clear Steps <MenubarShortcut>⌘ alt C</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onSelect={handleClearSessionClick}>
            Clear Session <MenubarShortcut>⌘ alt D</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Layout</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onSelect={() => setIsLayoutUnlocked((prev) => !prev)}>
            {`${isLayoutUnlocked ? 'Lock' : 'Unlock'} Track Layout`}{' '}
            <MenubarShortcut>⌘ alt T</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
