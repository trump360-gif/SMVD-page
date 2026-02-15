'use client';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

const DEFAULT_COLORS = [
  '#ff5f5aff',
  '#ffcc54ff',
  '#a24affff',
  '#53c9ffff',
  '#70d970ff',
  '#1e90ffff',
  '#ff6b9dff',
  '#32cd32ff',
  '#20b2aaff',
];

const COLOR_NAMES: Record<string, string> = {
  '#ff5f5aff': 'Red',
  '#ffcc54ff': 'Yellow',
  '#a24affff': 'Purple',
  '#53c9ffff': 'Sky Blue',
  '#70d970ff': 'Green',
  '#1e90ffff': 'Blue',
  '#ff6b9dff': 'Pink',
  '#32cd32ff': 'Lime',
  '#20b2aaff': 'Teal',
};

export default function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const isSelected = (color: string) => {
    return value.toLowerCase() === color.toLowerCase();
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        {DEFAULT_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={`w-8 h-8 rounded-lg transition-all ${
              isSelected(color)
                ? 'ring-2 ring-offset-2 ring-blue-500 scale-110'
                : 'hover:scale-105'
            }`}
            style={{ backgroundColor: color }}
            title={COLOR_NAMES[color] || color}
            aria-label={`Select color ${COLOR_NAMES[color] || color}`}
          />
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg border border-gray-300"
          style={{ backgroundColor: value }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#ff5f5aff"
          className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition font-mono"
        />
        <input
          type="color"
          value={value.slice(0, 7)}
          onChange={(e) => onChange(e.target.value + 'ff')}
          className="w-8 h-8 rounded cursor-pointer border border-gray-300"
          title="Custom color"
        />
      </div>
    </div>
  );
}
