"use client";

import * as React from "react";
import QRCode from "qrcode";

/**
 * Renders a real QR code into a canvas. The payload encodes the user's
 * (or batch's) verification token; in production this would be a signed
 * JWT or short-lived nonce.
 *
 * Style: white card with rounded corners, soft shadow, no border.
 */
export function QRDisplay({
  value,
  size = 220,
  label,
}: {
  value: string;
  size?: number;
  label?: string;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!canvasRef.current) return;
      try {
        await QRCode.toCanvas(canvasRef.current, value, {
          width: size,
          margin: 1,
          errorCorrectionLevel: "H",
          color: {
            dark: "#0f1115",
            light: "#ffffff",
          },
        });
      } catch (e) {
        if (!cancelled) console.warn("Failed to render QR", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [value, size]);

  return (
    <figure className="flex flex-col items-center gap-3">
      <div className="relative rounded-xl bg-white p-5 shadow-floating">
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="block"
          aria-label={label ?? `QR code containing ${value}`}
        />
        {/* Corner accents — premium scanner-style framing */}
        <span className="absolute -top-1 -left-1 h-5 w-5 rounded-tl-md border-t-2 border-l-2 border-primary-400" />
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-tr-md border-t-2 border-r-2 border-primary-400" />
        <span className="absolute -bottom-1 -left-1 h-5 w-5 rounded-bl-md border-b-2 border-l-2 border-primary-400" />
        <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-br-md border-b-2 border-r-2 border-primary-400" />
      </div>
      {label && (
        <figcaption className="text-caption text-gray-400 tracking-widest uppercase">
          {label}
        </figcaption>
      )}
    </figure>
  );
}
