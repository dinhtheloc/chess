import type { MetaFunction } from "@remix-run/node";
import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useEffect, useState } from "react";
// import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const chess = new Chess(
  "4r1k1/p1prnpb1/Pp1pq1pp/3Np2P/2P1P3/R4N2/1PP2PP1/3QR1K1 w - - 2 20"
);


export const meta: MetaFunction = () => {
  return [
    { title: "Chess" },
    { name: "description", content: "Welcome to Chess!" },
  ];
};

const getPieceImage = (color: Color, type: PieceSymbol) => {
  const piecesMap = {
    bb: "/images/chess/bb.png",
    bk: "/images/chess/bk.png",
    bn: "/images/chess/bn.png",
    bp: "/images/chess/bp.png",
    bq: "/images/chess/bq.png",
    br: "/images/chess/br.png",
    wb: "/images/chess/wb.png",
    wk: "/images/chess/wk.png",
    wn: "/images/chess/wn.png",
    wp: "/images/chess/wp.png",
    wq: "/images/chess/wq.png",
    wr: "/images/chess/wr.png",
  };
  return piecesMap[`${color}${type}`];
};

export default function Index() {
  const [board, setBoard] = useState(chess.board());
  const [pieceSelected, setPieceSelected] = useState<Square | null>(null);
  const [hints, setHints] = useState<string[]>([]);

  const getHint = (square: Square) => {

    setHints(
      chess.moves({ square }).map((move) => {
        return move;
      })
    );
  };

  useEffect(() => {
    if (pieceSelected) {
      getHint(pieceSelected);
    }

    console.log({ pieceSelected });
  }, [pieceSelected]);

  const getColIndexMap = (colIndex: number) => {
    const colIndexMap: { [key: number]: string } = {
      0: "a",
      1: "b",
      2: "c",
      3: "d",
      4: "e",
      5: "f",
      6: "g",
      7: "h",
    };

    return colIndexMap[colIndex];
  };

  const getRowIndexMap = (rowIndex: number) => {
    const rowIndexMap: { [key: number]: string } = {
      0: "8",
      1: "7",
      2: "6",
      3: "5",
      4: "4",
      5: "3",
      6: "2",
      7: "1",
    };

    return rowIndexMap[rowIndex];
  };

  const getIndexOfSquare = (rowIndex: number, colIndex: number) => {
    return `${getColIndexMap(colIndex)}${getRowIndexMap(rowIndex)}` as Square;
  };

  const containsKey = (arr: string[], key: string) => {
    return arr.some((move) => move.includes(key));
  };

  const handleSelected = (square: Square) => () => {
    if (pieceSelected && containsKey(hints, square)) {
      console.log("move", pieceSelected, square);
      chess.move(`${pieceSelected}${square}`);
      console.log(chess.ascii());
      setBoard(chess.board());
      setPieceSelected(null);
      setHints([]);
    } else {
      setPieceSelected(square);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <div className="grid grid-cols-[repeat(8,80px)] grid-rows-[repeat(8,80px)]">
        {board.map((row, rowIndex) =>
          row.map((square, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={cn(
                `w-[80px] h-[80px] relative`,
                pieceSelected === square?.square
                  ? "bg-yellow-200"
                  : (rowIndex + colIndex) % 2 === 0
                  ? "bg-[#ebecd0]"
                  : "bg-[#739552]"
              )}
              onClick={handleSelected(square?.square || getIndexOfSquare(rowIndex, colIndex))} aria-hidden="true"
            >
              {colIndex === 0 && (
                <div
                  className={cn(
                    "opacity-80 absolute top-0.5 left-0.5 font-bold",
                    (rowIndex + colIndex) % 2 === 0
                      ? "text-[#739552]"
                      : "text-[#ebecd0]"
                  )}
                >
                  {getRowIndexMap(rowIndex)}
                </div>
              )}

              {rowIndex === 7 && (
                <div
                  className={cn(
                    "opacity-80 absolute bottom-0.5 right-0.5 font-bold",
                    (rowIndex + colIndex) % 2 === 0
                      ? "text-[#739552]"
                      : "text-[#ebecd0]"
                  )}
                >
                  {getColIndexMap(colIndex)}
                </div>
              )}

              <div
                className={cn(
                  "w-[30px] h-[30px] rounded-full bg-card opacity-40 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]",
                  containsKey(hints, getIndexOfSquare(rowIndex, colIndex))
                    ? "block"
                    : "hidden"
                )}
              ></div>

              {square && (
                <div>
                  <img
                    src={getPieceImage(square.color, square.type)}
                    alt={`${square.color}${square.type}`}
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* <Button
        onClick={() => {
          chess.move("e2e4");
          console.log(chess.ascii());
          setBoard(chess.board());
        }}
      >
        Start Game
      </Button> */}
    </div>
  );
}
