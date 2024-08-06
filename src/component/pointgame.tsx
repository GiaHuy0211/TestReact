import { useEffect, useRef, useState } from "react";

type Point = {
  id: number;
  x: number;
  y: number;
};

export default function ClearThePointGame() {
  const [boxWidth, setBoxWidth] = useState(0);
  const [boxHeight, setBoxHeight] = useState(0);
  const [currentPoint, setCurrentPoint] = useState<number | undefined>(undefined);
  const [pointList, setPointList] = useState<Point[]>([]);
  const [status, setStatus] = useState<"idle" | "playing" | "finished">("idle");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [headerTitle, setHeaderTitle] = useState<string>("LET'S PLAY");
  const [headerClass, setHeaderClass] = useState<string>("text-black");
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const circleDiameter = 40;

  useEffect(() => {
    if (boxRef.current) {
      const box = boxRef.current.getBoundingClientRect();
      setBoxWidth(box.width);
      setBoxHeight(box.height);
    }
  }, []);

  useEffect(() => {
    let interval = null;
    if (status === "playing") {
      interval = setInterval(() => {
        setElapsedTime((prevTime) => +(prevTime + 0.1).toFixed(1));
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status]);

  const startGame = (numPoints: number) => {
    const newPoints: Point[] = Array.from({ length: numPoints }, (_, i) => ({
      id: i + 1,
      x: Math.floor(Math.random() * (boxWidth - circleDiameter)),
      y: Math.floor(Math.random() * (boxHeight - circleDiameter)),
    }));
    setCurrentPoint(1);
    setHeaderTitle("LET'S PLAY");
    setHeaderClass("text-black");
    setPointList(newPoints);
    setElapsedTime(0);
    setStatus("playing");
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const numPoints = Number(inputRef.current?.value);
    if (numPoints) {
      startGame(numPoints);
    }
  };

  const handlePointClick = (pointId: number) => {
    if (pointId === currentPoint) {
      const remainingPoints = pointList.filter((point) => point.id !== pointId);
      setPointList(remainingPoints);
      if (remainingPoints.length === 0) {
        setHeaderTitle("ALL CLEARED");
        setHeaderClass("text-green-500");
        setStatus("finished");
      } else {
        setCurrentPoint(currentPoint! + 1);
      }
    } else {
      setHeaderTitle("GAME OVER");
      setHeaderClass("text-red-500");
      setStatus("finished");
    }
  };

  const restartGame = () => {
    const numPoints = Number(inputRef.current?.value);
    if (numPoints) {
      startGame(numPoints);
    }
  };

  return (
    <div>
      <h1 className={`mb-5 font-bold ${headerClass}`}>{headerTitle}</h1>
      <form onSubmit={handleFormSubmit}>
        <div className="flex items-center gap-5 mb-5">
          <span>Points:</span>
          <input ref={inputRef} type="number" className="border border-slate-500" />
        </div>
        <p className="mb-5">
          Time: <span className="ml-5">{elapsedTime.toFixed(1)}s</span>
        </p>
        {status === "idle" ? (
          <button type="submit" className="px-8 py-1 mb-5 border border-gray-700">
            Play
          </button>
        ) : (
          <button type="button" onClick={restartGame} className="px-8 py-1 mb-5 border border-gray-700">
            Restart
          </button>
        )}
      </form>
      <div ref={boxRef} className="border border-black h-[400px] w-1/5 relative">
        {pointList.map((point) => (
          <div
            onClick={() => handlePointClick(point.id)}
            className="size-10 absolute rounded-full transition-all hover:bg-green-500 bg-white border-2 border-gray-700 flex items-center justify-center cursor-pointer"
            key={point.id}
            style={{ top: `${point.y}px`, left: `${point.x}px` }}
          >
            {point.id}
          </div>
        ))}
      </div>
    </div>
  );
}
