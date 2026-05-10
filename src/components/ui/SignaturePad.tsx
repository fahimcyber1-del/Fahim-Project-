import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import SignaturePad from 'signature_pad';

interface Props {
  canvasProps?: React.CanvasHTMLAttributes<HTMLCanvasElement>;
  backgroundColor?: string;
}

export interface SignaturePadRef {
  clear: () => void;
  toDataURL: () => string;
  isEmpty: () => boolean;
  fromDataURL: (dataUrl: string) => void;
}

const SignaturePadComponent = forwardRef<SignaturePadRef, Props>(({ canvasProps, backgroundColor = 'rgba(0,0,0,0)' }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<SignaturePad | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      padRef.current = new SignaturePad(canvasRef.current, {
        backgroundColor: backgroundColor,
      });

      const resizeCanvas = () => {
        if (!canvasRef.current || !padRef.current) return;
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * ratio;
        canvas.height = rect.height * ratio;
        canvas.getContext('2d')?.scale(ratio, ratio);
        padRef.current.clear();
      };

      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();

      return () => {
        window.removeEventListener('resize', resizeCanvas);
        padRef.current?.off();
      };
    }
  }, [backgroundColor]);

  useImperativeHandle(ref, () => ({
    clear: () => padRef.current?.clear(),
    toDataURL: () => padRef.current?.toDataURL() || '',
    isEmpty: () => padRef.current?.isEmpty() || true,
    fromDataURL: (dataUrl: string) => padRef.current?.fromDataURL(dataUrl),
  }));

  return <canvas ref={canvasRef} {...canvasProps} />;
});

SignaturePadComponent.displayName = 'SignaturePad';

export default SignaturePadComponent;
