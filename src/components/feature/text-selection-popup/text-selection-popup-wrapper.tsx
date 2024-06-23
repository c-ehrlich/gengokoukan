import { StopPropagation } from "~/components/_utils/stop-propagation";
import { type Position } from "./position";

export function TextSelectionPopupWrapper({
  children,
  wrapperClassName,
  modalPosition,
  isVisible,
}: {
  children: React.ReactNode;
  wrapperClassName?: string;
  modalPosition: Position;
  isVisible: boolean;
}) {
  if (!isVisible) return null;

  return (
    <StopPropagation>
      <div
        className={wrapperClassName}
        style={{
          position: "absolute",
          top: modalPosition.top,
          left: modalPosition.left,
          backgroundColor: "white",
          color: "black",
          border: "1px solid black",
          padding: "10px",
        }}
      >
        {children}
      </div>
    </StopPropagation>
  );
}
