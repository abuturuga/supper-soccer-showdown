import { useState, useEffect } from "react";
import type { Lineup } from "../domain";

const PlayerCircle = ({
    active,
    activeClass,
    disabled,
    onClick,
}: {
    active: boolean;
    activeClass: string;
    disabled?: boolean;
    onClick: () => void;
}) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`w-10 h-10 rounded-full border-2 border-white transition-colors
            ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"}
            ${active ? activeClass : "bg-white/20 hover:bg-white/40"}`}
    />
);

const toggleArr = (arr: boolean[], i: number): boolean[] =>
    arr.map((v, j) => (j === i ? !v : v));

const MAX_OUTFIELD = 4;

type TeamSide = "home" | "away";

const TeamHalf = ({ side, onLineupChange }: { side: TeamSide; onLineupChange: (l: Lineup) => void }) => {
    const [defRow, setDefRow] = useState([true, true, false]);
    const [attRow, setAttRow] = useState([true, true, false]);

    useEffect(() => {
        onLineupChange({
            defenders: defRow.filter(Boolean).length as Lineup['defenders'],
            attackers: attRow.filter(Boolean).length as Lineup['attackers'],
        });
    }, [defRow, attRow]);

    const isHome = side === "home";
    const activeClass = isHome ? "bg-blue-400" : "bg-red-400";

    const gkPos = isHome ? "bottom-[4%]" : "top-[4%]";
    const defRowPos = isHome ? "bottom-[15%]" : "top-[15%]";
    const attRowPos = isHome ? "bottom-[35%]" : "top-[35%]";

    const totalSelected = defRow.filter(Boolean).length + attRow.filter(Boolean).length;
    const atMax = totalSelected >= MAX_OUTFIELD;

    const handleToggle = (
        row: boolean[],
        setRow: React.Dispatch<React.SetStateAction<boolean[]>>,
        i: number
    ) => {
        const isDeselecting = row[i];
        if (isDeselecting && row.filter(Boolean).length <= 1) return; // keep min 1 per row
        if (!isDeselecting && atMax) return; // cap at MAX_OUTFIELD
        setRow((r) => toggleArr(r, i));
    };

    return (
        <>
            <div className={`absolute ${gkPos} left-1/2 -translate-x-1/2`}>
                <PlayerCircle
                    active
                    activeClass="bg-yellow-400"
                    disabled
                    onClick={() => {}}
                />
            </div>

            <div className={`absolute ${defRowPos} w-full flex justify-around px-12`}>
                {defRow.map((active, i) => (
                    <PlayerCircle
                        key={i}
                        active={active}
                        activeClass={activeClass}
                        disabled={!active && atMax}
                        onClick={() => handleToggle(defRow, setDefRow, i)}
                    />
                ))}
            </div>

            <div className={`absolute ${attRowPos} w-full flex justify-around px-12`}>
                {attRow.map((active, i) => (
                    <PlayerCircle
                        key={i}
                        active={active}
                        activeClass={activeClass}
                        disabled={!active && atMax}
                        onClick={() => handleToggle(attRow, setAttRow, i)}
                    />
                ))}
            </div>
        </>
    );
};

export const Field = ({
    onHomeLineupChange,
    onAwayLineupChange,
}: {
    onHomeLineupChange: (l: Lineup) => void;
    onAwayLineupChange: (l: Lineup) => void;
}) => {
    return (
        <div className="relative flex flex-col bg-green-600 h-full border-4 border-white rounded-xl overflow-hidden shadow">
            {/* Top penalty area */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[18%] border-2 border-white border-t-0" />
            {/* Top goal area */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/4 h-[8%] border-2 border-white border-t-0" />

            {/* Halfway line */}
            <div className="absolute top-1/2 -translate-y-1/2 w-full h-0.5 bg-white" />

            {/* Center circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 border-white" />
            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white" />

            {/* Bottom penalty area */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[18%] border-2 border-white border-b-0" />
            {/* Bottom goal area */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/4 h-[8%] border-2 border-white border-b-0" />

            <TeamHalf side="away" onLineupChange={onAwayLineupChange} />
            <TeamHalf side="home" onLineupChange={onHomeLineupChange} />
        </div>
    );
};
