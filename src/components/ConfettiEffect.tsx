import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { colors } from '../theme/theme';

interface ConfettiEffectProps {
  active: boolean;
  origin?: { x: number; y: number };
}

export const ConfettiEffect = ({ active, origin }: ConfettiEffectProps) => {
  const { width, height } = useWindowSize();
  const [isActive, setIsActive] = useState(false);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (active) {
      setIsActive(true);
      setOpacity(1);

      // Start fade out after 2 seconds (1 second before ending)
      const fadeTimer = setTimeout(() => {
        setOpacity(0);
      }, 2000);

      // Stop after 3 seconds total
      const stopTimer = setTimeout(() => {
        setIsActive(false);
      }, 3000);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(stopTimer);
      };
    }
  }, [active]);

  if (!isActive) return null;

  // Position at bottom right (where Collect Star button is) - behind the button
  const confettiOrigin = {
    x: origin?.x ?? width - 120,  // Bottom right with offset for button
    y: origin?.y ?? height,       // Behind button at very bottom
    w: 0,
    h: 0,
  };

  // Multi-color confetti using primary, secondary, and tertiary theme colors
  const confettiColors = [
    colors.primary.main,    // Purple #743799
    colors.primary.light,   // Light Purple #E6D9F0
    colors.secondary.main,  // Pink #E16BBA
    colors.secondary.light, // Light Pink #F5E0EF
    colors.tertiary.main,   // Orange/Peach #FEBA7B
    colors.tertiary.light,  // Light Peach #FFF4EB
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      opacity,
      transition: 'opacity 1s ease-out',
      zIndex: 0
    }}>
      <Confetti
        width={width}
        height={height}
        recycle={false}
        numberOfPieces={1000}
        gravity={0.0563}
        colors={confettiColors}
        confettiSource={confettiOrigin}
        initialVelocityY={3.75}
        initialVelocityX={3.75}
      />
    </div>
  );
};
