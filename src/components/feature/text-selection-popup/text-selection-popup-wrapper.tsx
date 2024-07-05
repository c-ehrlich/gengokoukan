import {
  Dialog,
  DialogContent,
} from "~/components/_primitives/shadcn-raw/dialog";

// TODO: this doesnt need to be a separate component!!

export function TextSelectionPopupWrapper({
  children,
  isVisible,
}: {
  children: React.ReactNode;
  isVisible: boolean;
  selectedText: string;
}) {
  if (!isVisible) return null;

  return (
    <Dialog
      open={isVisible}
      onOpenChange={(open) => {
        if (!open) {
          window.getSelection()?.removeAllRanges();
        }
      }}
    >
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}
