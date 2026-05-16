"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Camera, RefreshCw, ZapOff } from "lucide-react";
import { Button } from "@/components/ui/button";

type ScannerStatus = "idle" | "requesting" | "ready" | "denied" | "unsupported";

interface DetectedBarcode {
  rawValue: string;
}

type AnyBarcodeDetector = new (opts?: {
  formats?: string[];
}) => {
  detect: (source: CanvasImageSource) => Promise<DetectedBarcode[]>;
};

export function QRScanner({ onResult }: { onResult: (value: string) => void }) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const [status, setStatus] = React.useState<ScannerStatus>("idle");
  const [error, setError] = React.useState<string | null>(null);

  const start = React.useCallback(async () => {
    setStatus("requesting");
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus("ready");

      const Detector = (window as unknown as { BarcodeDetector?: AnyBarcodeDetector })
        .BarcodeDetector;
      if (Detector) {
        const detector = new Detector({ formats: ["qr_code"] });
        const tick = async () => {
          if (!videoRef.current || status === "denied") return;
          try {
            const codes = await detector.detect(videoRef.current);
            if (codes && codes.length) {
              onResult(codes[0].rawValue);
              stop();
              return;
            }
          } catch {
            /* swallow per-frame errors */
          }
          rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
      }
    } catch (e) {
      const msg = (e as Error).message;
      setError(msg);
      if (msg.toLowerCase().includes("permission")) {
        setStatus("denied");
      } else {
        setStatus("unsupported");
      }
    }
  }, [onResult, status]);

  const stop = React.useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  React.useEffect(() => () => stop(), [stop]);

  return (
    <div className="surface-card overflow-hidden p-0">
      <div className="relative aspect-square w-full bg-black">
        <video
          ref={videoRef}
          playsInline
          muted
          className="absolute inset-0 h-full w-full object-cover"
        />
        {status !== "ready" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/60 text-center px-6">
            {status === "idle" && (
              <>
                <Camera size={36} className="text-primary-400" />
                <p className="text-small text-gray-300 max-w-[28ch]">
                  Point the camera at a depositor&apos;s QR code to scan it
                </p>
                <Button size="md" onClick={start}>
                  Enable camera
                </Button>
              </>
            )}
            {status === "requesting" && (
              <p className="text-small text-gray-300">Requesting camera access…</p>
            )}
            {status === "denied" && (
              <>
                <ZapOff size={28} className="text-danger" />
                <p className="text-small text-gray-300 max-w-[28ch]">
                  Camera permission was blocked. Update browser settings or use manual entry below.
                </p>
                <Button size="md" variant="secondary" onClick={start}>
                  <RefreshCw size={16} /> Try again
                </Button>
              </>
            )}
            {status === "unsupported" && (
              <>
                <ZapOff size={28} className="text-warning" />
                <p className="text-small text-gray-300 max-w-[30ch]">
                  Camera not available on this device. Use manual entry below.
                </p>
              </>
            )}
          </div>
        )}

        {status === "ready" && (
          <>
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2">
                <Corner className="absolute -top-1 -left-1 rotate-0" />
                <Corner className="absolute -top-1 -right-1 rotate-90" />
                <Corner className="absolute -bottom-1 -left-1 -rotate-90" />
                <Corner className="absolute -bottom-1 -right-1 rotate-180" />
                <motion.div
                  className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary-400 to-transparent shadow-glow"
                  initial={{ top: "0%" }}
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(transparent_40%,rgba(0,0,0,0.55)_75%)]" />
          </>
        )}
      </div>
      <div className="flex items-center justify-between p-4">
        <p className="text-caption text-gray-400">
          {status === "ready" ? "Align QR within frame" : "Camera idle"}
        </p>
        {status === "ready" && (
          <Button size="sm" variant="secondary" onClick={stop}>
            Stop
          </Button>
        )}
      </div>
      {error && status !== "ready" && (
        <p className="px-4 pb-3 text-caption text-danger">{error}</p>
      )}
    </div>
  );
}

function Corner({ className }: { className?: string }) {
  return (
    <span
      className={`block h-6 w-6 border-t-[3px] border-l-[3px] border-primary-400 rounded-tl-md ${className ?? ""}`}
    />
  );
}
