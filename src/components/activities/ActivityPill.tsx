import React from "react";

export interface ActivityPillProps {
  name: string;
  color: string;
}

const ActivityPill: React.FC<ActivityPillProps> = ({ name, color }) => {
  return (
    <div
      className="text-xs px-2 py-1 rounded-full text-white font-medium truncate max-w-full"
      style={{ backgroundColor: color }}
    >
      {name}
    </div>
  );
};

export default ActivityPill;
