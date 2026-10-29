import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ProfileLinkProps {
  onOpen: () => void;
}

export default function ProfileLink({ onOpen }: ProfileLinkProps) {
  return (
    <button
      type="button"
      onClick={event => {
        event.stopPropagation();
        onOpen();
      }}
      className="inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-1 text-[10px] font-medium text-indigo-600 transition hover:bg-indigo-100 hover:text-indigo-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-1"
    >
      查看完整画像
      <ArrowRight className="h-3 w-3" />
    </button>
  );
}
