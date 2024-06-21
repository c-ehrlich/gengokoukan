"use client";

import React, { useState, useEffect } from "react";

export const TextWithTooltip = ({ text }: { text: string }) => {
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [selectionRect, setSelectionRect] = useState<DOMRect | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim() !== "") {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setSelectedText(selection.toString());
        setSelectionRect(rect);
        setIsOpen(true);
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleButtonClick = () => {
    if (selectedText) {
      console.log(selectedText);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid black",
        position: "relative",
        minHeight: "500px",
      }}
    >
      <span>{text}</span>
      {isOpen && selectionRect && (
        <div>
          <div>
            {selectedText}
            <button
              onClick={handleButtonClick}
              style={{
                marginLeft: "10px",
                color: "white",
                backgroundColor: "black",
                border: "none",
                cursor: "pointer",
              }}
            >
              Log Text
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
