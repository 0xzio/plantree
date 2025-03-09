import {
  useEditorReadOnly,
  useEditorRef,
  useElement,
} from '@udecode/plate/react';

import { type TProductElement, CALLOUT_STORAGE_KEY } from '../../lib';

export interface UseCalloutEmojiPickerOptions {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useCalloutEmojiPicker = ({
  isOpen,
  setIsOpen,
}: UseCalloutEmojiPickerOptions) => {
  const editor = useEditorRef();
  const readOnly = useEditorReadOnly();
  const element = useElement<TProductElement>();

  return {
    emojiToolbarDropdownProps: {
      isOpen,
      setIsOpen: (v: boolean) => {
        if (readOnly) return;

        setIsOpen(v);
      },
    },
    props: {
      isOpen,
      setIsOpen,
      onSelectEmoji: (emojiValue: any) => {
        const icon = emojiValue.skins?.[0]?.native ?? emojiValue.icon;

        editor.tf.setNodes<TProductElement>(
          {
            icon,
          },
          { at: element }
        );

        localStorage.setItem(CALLOUT_STORAGE_KEY, icon);
        setIsOpen(false);
      },
    },
  };
};
