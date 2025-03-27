import { format, getDay, getYear, setDayOfYear } from "date-fns";

export const GhButton = ({
  count,
  setCount,
  tooltipText,
}: {
  count: number;
  setCount: (count: number) => void;
  tooltipText: string;
}) => (
  <button
    className={`w-[15px] h-[15px] text-[8px] text-white border-[1px] rounded-[2px] ct-${Math.min(
      count,
      4
    )} tooltip tooltip-top`}
    data-tip={tooltipText}
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

export const GhPlaceholder = () => (
  <div className="w-[15px] h-[15px] text-[8px] text-white border-[1px] rounded-[2px] ct-0" />
);

export const YearCommitBox = ({
  year,
  count,
  setCount,
}: {
  year: number;
  count: number[];
  setCount: (idx: number, count: number) => void;
}) => (
  <div className="grid grid-cols-54 gap-[5px] w-fit">
    {Array(54)
      .fill(0)
      .map((_, i) => (
        <div key={i} className="grid grid-rows-7 gap-[5px]">
          {Array(7)
            .fill(0)
            .map((_, j) => {
              const firstDayOfYear = getDay(new Date(year, 0, 1));
              const dayOfYear = 7 * i + j + 1 - firstDayOfYear;
              const dateForBox = setDayOfYear(new Date(year, 0, 1), dayOfYear);
              const isBeforeFirstDayOfYear = i === 0 && j < firstDayOfYear;
              const isAfterLastDayOfYear =
                i >= 52 && getYear(dateForBox) !== year;

              if (isBeforeFirstDayOfYear || isAfterLastDayOfYear) {
                return <GhPlaceholder key={`${i}-${j}`} />;
              }
              return (
                <GhButton
                  key={`${i}-${j}`}
                  count={count[dayOfYear]}
                  setCount={(count) => setCount(dayOfYear, count)}
                  tooltipText={
                    format(dateForBox, "yyyy/MM/dd") + " " + dayOfYear
                  }
                />
              );
            })}
        </div>
      ))}
  </div>
);
