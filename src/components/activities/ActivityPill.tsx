import React from "react";

export interface ActivityPillProps {
  name: string;
  color: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const ActivityPill: React.FC<ActivityPillProps> = ({
  name,
  color,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="text-xs px-2 py-1 rounded-full text-white font-medium truncate max-w-full"
      style={{ backgroundColor: color }}
    >
      {name}
    </div>
  );
};

export default ActivityPill;
