export const GhButton = ({
  count,
  setCount,
}: {
  count: number;
  setCount: (count: number) => void;
}) => (
  <button
    className={`w-[15px] h-[15px] text-[8px] text-white border-[1px] rounded-[2px] ct-${Math.min(
      count,
      4
    )}`}
    onMouseUp={(e: React.MouseEvent<HTMLButtonElement>) => {
      if (e.button === 0) {
        setCount(count + 1);
      } else if (e.button === 2) {
        setCount(count > 0 ? count - 1 : 0);
      }
    }}
    onContextMenu={(e) => e.preventDefault()}
  >
    {count}
  </button>
);
