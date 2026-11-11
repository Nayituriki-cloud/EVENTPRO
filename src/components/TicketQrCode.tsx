import React, { useMemo } from 'react';

interface TicketQrCodeProps {
  value: string;
  size?: number;
  className?: string;
  darkColor?: string;
  lightColor?: string;
}

/**
 * Procedural SVG QR Code Generator with standard 3 finder corners,
 * timing patterns, and pseudo-random deterministic matrix derived from the payload.
 */
export const TicketQrCode: React.FC<TicketQrCodeProps> = ({
  value,
  size = 180,
  className = '',
  darkColor = '#0B0B12',
  lightColor = '#FFFFFF',
}) => {
  const gridSize = 25; // 25x25 matrix

  const matrix = useMemo(() => {
    // Generate pseudo-random deterministic seed from string
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = (hash << 5) - hash + value.charCodeAt(i);
      hash |= 0;
    }

    const grid: boolean[][] = Array.from({ length: gridSize }, () =>
      Array(gridSize).fill(false)
    );

    // Draw finder pattern helper
    const drawFinder = (startX: number, startY: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const isOuterBorder = r === 0 || r === 6 || c === 0 || c === 6;
          const isInnerSquare = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          grid[startY + r][startX + c] = isOuterBorder || isInnerSquare;
        }
      }
    };

    // 3 Corner Finders
    drawFinder(0, 0); // Top-left
    drawFinder(gridSize - 7, 0); // Top-right
    drawFinder(0, gridSize - 7); // Bottom-left

    // Timing strips
    for (let i = 8; i < gridSize - 8; i++) {
      grid[6][i] = i % 2 === 0;
      grid[i][6] = i % 2 === 0;
    }

    // Alignment pattern near bottom right
    const alignX = gridSize - 9;
    const alignY = gridSize - 9;
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        const isBorder = r === 0 || r === 4 || c === 0 || c === 4;
        const isCenter = r === 2 && c === 2;
        grid[alignY + r][alignX + c] = isBorder || isCenter;
      }
    }

    // Fill data area with seeded pseudo-random bytes
    let seed = Math.abs(hash);
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        // Skip finder areas
        const inTopLeft = r < 8 && c < 8;
        const inTopRight = r < 8 && c >= gridSize - 8;
        const inBottomLeft = r >= gridSize - 8 && c < 8;
        const inTiming = r === 6 || c === 6;
        const inAlign = r >= alignY && r < alignY + 5 && c >= alignX && c < alignX + 5;

        if (!inTopLeft && !inTopRight && !inBottomLeft && !inTiming && !inAlign) {
          seed = (seed * 9301 + 49297) % 233280;
          const bit = seed / 233280 > 0.48;
          grid[r][c] = bit;
        }
      }
    }

    return grid;
  }, [value]);

  const cellSize = size / gridSize;

  return (
    <div
      className={`relative inline-flex items-center justify-center p-2 rounded-xl bg-white shadow-md ${className}`}
      style={{ width: size + 16, height: size + 16 }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="rounded-lg"
      >
        <rect width={size} height={size} fill={lightColor} />
        {matrix.map((row, r) =>
          row.map((filled, c) =>
            filled ? (
              <rect
                key={`${r}-${c}`}
                x={c * cellSize}
                y={r * cellSize}
                width={cellSize + 0.15}
                height={cellSize + 0.15}
                fill={darkColor}
              />
            ) : null
          )
        )}
      </svg>
      {/* Central branding mini badge */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-7 h-7 bg-purple-600 rounded-md border-2 border-white flex items-center justify-center shadow-sm">
          <span className="text-[10px] font-black text-white tracking-tighter">EP</span>
        </div>
      </div>
    </div>
  );
};
