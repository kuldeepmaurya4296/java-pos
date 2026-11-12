import { useEffect, useRef } from 'react';

interface UseBarcodeScannerOptions {
  onScan: (barcode: string) => void;
  minChars?: number;
  maxDelayMs?: number;
}

/**
 * High-speed hardware barcode scanner listener.
 * Captures rapid sequential keyboard inputs typical of handheld USB/Bluetooth barcode scanners.
 */
export const useBarcodeScanner = ({
  onScan,
  minChars = 4,
  maxDelayMs = 50,
}: UseBarcodeScannerOptions) => {
  const bufferRef = useRef<string>('');
  const lastKeyTimeRef = useRef<number>(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if cashier is typing in a text input or textarea
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') &&
        !(target as HTMLInputElement).classList.contains('barcode-capture')
      ) {
        return;
      }

      const currentTime = Date.now();
      const timeDiff = currentTime - lastKeyTimeRef.current;

      if (e.key === 'Enter') {
        if (bufferRef.current.length >= minChars) {
          e.preventDefault();
          onScan(bufferRef.current.trim());
        }
        bufferRef.current = '';
        return;
      }

      // Check if keystrokes are coming in rapidly (scanner behavior)
      if (timeDiff > maxDelayMs && bufferRef.current.length > 0) {
        // Reset buffer if delay is too long (human typing)
        bufferRef.current = '';
      }

      if (e.key.length === 1) {
        bufferRef.current += e.key;
        lastKeyTimeRef.current = currentTime;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onScan, minChars, maxDelayMs]);
};

