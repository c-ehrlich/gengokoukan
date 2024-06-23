export const StopPropagation = ({
  onClick,
  ...passthrough
}: JSX.IntrinsicElements["div"]) => {
  return (
    <div
      role="none"
      onClick={(event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();

        onClick?.(event);
      }}
      {...passthrough}
    />
  );
};
