import React from "react";
import { predefinedColors } from "../constants/colors";

interface ColorPickerProps {
  selectedColor: string; // The currently selected color
  onColorSelect: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onColorSelect,
}) => {
  const handleColorSelect = (colorCode: string) => {
    onColorSelect(colorCode);
  };

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium">Color</label>

      <div className="flex items-center space-x-4">
        {predefinedColors.map((color) => (
          <button
            key={color.code}
            onClick={() => handleColorSelect(color.code)}
            style={{ backgroundColor: color.code }}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              selectedColor === color.code
                ? "border-gray-300"
                : "border-transparent"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
