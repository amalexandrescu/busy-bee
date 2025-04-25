import React from "react";
import { predefinedColors } from "../constants/colors";

interface ColorPickerProps {
  selectedColor: string; // The currently selected color
  onColorSelect: (color: string) => void;
  disabled?: boolean;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onColorSelect,
  disabled,
}) => {
  const handleColorSelect = (colorCode: string) => {
    if (!disabled) {
      onColorSelect(colorCode);
    }
  };

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium">Color</label>

      <div className="flex items-center space-x-4">
        {predefinedColors.map((color) => (
          <button
            key={color.code}
            onClick={() => handleColorSelect(color.code)}
            disabled={disabled}
            style={{ backgroundColor: color.code }}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              selectedColor === color.code
                ? "border-gray-300"
                : "border-transparent"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
