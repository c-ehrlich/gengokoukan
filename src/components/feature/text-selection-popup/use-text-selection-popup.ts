import { useState, useRef, useEffect, useCallback } from "react";

interface Position {
  top: number;
  left: number;
}

const DUMB_HACK_POPUP_OFFSET = 175;

export function useTextSelectionPopup() {
  const textContainerRef = useRef<HTMLDivElement>(null);

  const [modalPosition, setModalPosition] = useState<Position>({
    top: 0,
    left: 0,
  });

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [selectedText, setSelectedText] = useState("");

  const closeModal = useCallback(() => {
    setIsVisible(false);
    setSelectedText("");
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!isVisible) {
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) {
        const text = selection.toString();
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setModalPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX - DUMB_HACK_POPUP_OFFSET,
        });
        setIsVisible(true);
        setSelectedText(text);
      }
    }
  }, [isVisible, setModalPosition, setIsVisible, setSelectedText]);

  const handleClick = useCallback(() => {
    if (window.getSelection()?.toString().length === 0) {
      closeModal();
    }
  }, [closeModal]);

  useEffect(() => {
    if (isVisible) {
      const { innerWidth, innerHeight } = window;
      setModalPosition((prevPosition) => {
        const { top, left } = prevPosition;
        const adjustedTop = top + 50 > innerHeight ? innerHeight - 50 : top;
        const adjustedLeft = left + 150 > innerWidth ? innerWidth - 150 : left;
        return { top: adjustedTop, left: adjustedLeft };
      });
    }
  }, [isVisible]);

  useEffect(() => {
    const escListener = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keydown", escListener);

    return () => {
      document.removeEventListener("keydown", escListener);
    };
  }, [closeModal]);

  useEffect(() => {
    const clickOutsideListener = (event: MouseEvent) => {
      if (
        textContainerRef.current &&
        !textContainerRef.current.contains(event.target as Node)
      ) {
        closeModal();
      }
    };

    document.addEventListener("click", clickOutsideListener);

    return () => {
      document.removeEventListener("click", clickOutsideListener);
    };
  }, [closeModal]);

  return {
    containerProps: {
      ref: textContainerRef,
      onMouseUp: handleMouseUp,
      onClick: handleClick,
    },
    wrapperProps: { isVisible, closeModal, modalPosition },
    selectedText,
    closeModal,
  };
}
