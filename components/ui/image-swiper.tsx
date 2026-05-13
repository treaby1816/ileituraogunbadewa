"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface ImageSwiperProps {
  images: string;
  cardWidth?: number;
  cardHeight?: number;
  className?: string;
  onCardClick?: (index: number) => void;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export const ImageSwiper: React.FC<ImageSwiperProps> = ({
  images,
  cardWidth = 256,
  cardHeight = 352,
  className = '',
  onCardClick,
  autoPlay = true,
  autoPlayInterval = 3000
}) => {
  const cardStackRef = useRef<HTMLDivElement>(null);
  const isSwiping = useRef(false);
  const startX = useRef(0);
  const currentX = useRef(0);
  const totalMoved = useRef(0);
  const animationFrameId = useRef<number | null>(null);

  const imageList = React.useMemo(() => 
    images.split(',').map(img => img.trim()).filter(img => img),
    [images]
  );
  
  const [cardOrder, setCardOrder] = useState<number[]>(() =>
    Array.from({ length: imageList.length }, (_, i) => i)
  );

  const getDurationFromCSS = useCallback((
    variableName: string,
    element?: HTMLElement | null
  ): number => {
    const targetElement = element || document.documentElement;
    const value = getComputedStyle(targetElement)
      ?.getPropertyValue(variableName)
      ?.trim();
    if (!value) return 0;
    if (value.endsWith("ms")) return parseFloat(value);
    if (value.endsWith("s")) return parseFloat(value) * 1000;
    return parseFloat(value) || 0;
  }, []);

  const getCards = useCallback((): HTMLElement[] => {
    if (!cardStackRef.current) return [];
    return Array.from(cardStackRef.current.querySelectorAll('.image-card')) as HTMLElement[];
  }, []);

  const getActiveCard = useCallback((): HTMLElement | null => {
    const cards = getCards();
    return cards[0] || null;
  }, [getCards]);

  const updatePositions = useCallback(() => {
    const cards = getCards();
    cards.forEach((card, i) => {
      card.style.setProperty('--i', (i + 1).toString());
      card.style.setProperty('--swipe-x', '0px');
      card.style.setProperty('--swipe-rotate', '0deg');
      card.style.opacity = '1';
    });
  }, [getCards]);

  const applySwipeStyles = useCallback((deltaX: number) => {
    const card = getActiveCard();
    if (!card) return;
    card.style.setProperty('--swipe-x', `${deltaX}px`);
    card.style.setProperty('--swipe-rotate', `${deltaX * 0.2}deg`);
    card.style.opacity = (1 - Math.min(Math.abs(deltaX) / 100, 1) * 0.75).toString();
  }, [getActiveCard]);

  const handleStart = useCallback((clientX: number) => {
    if (isSwiping.current) return;
    isSwiping.current = true;
    startX.current = clientX;
    currentX.current = clientX;
    totalMoved.current = 0;
    const card = getActiveCard();
    if (card) card.style.transition = 'none';
  }, [getActiveCard]);

  const handleEnd = useCallback(() => {
    if (!isSwiping.current) return;
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }

    const deltaX = currentX.current - startX.current;
    const threshold = 50;
    const duration = getDurationFromCSS('--card-swap-duration', cardStackRef.current);
    const card = getActiveCard();

    if (card) {
      card.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;

      if (Math.abs(deltaX) > threshold) {
        const direction = Math.sign(deltaX);
        card.style.setProperty('--swipe-x', `${direction * 300}px`);
        card.style.setProperty('--swipe-rotate', `${direction * 20}deg`);

        setTimeout(() => {
          if (getActiveCard() === card) {
            card.style.setProperty('--swipe-rotate', `${-direction * 20}deg`);
          }
        }, duration * 0.5);

        setTimeout(() => {
          setCardOrder(prev => {
            if (prev.length === 0) return [];
            return [...prev.slice(1), prev[0]];
          });
        }, duration);
      } else {
        applySwipeStyles(0);
      }
    }

    isSwiping.current = false;
    startX.current = 0;
    currentX.current = 0;
  }, [getDurationFromCSS, getActiveCard, applySwipeStyles]);

  const handleMove = useCallback((clientX: number) => {
    if (!isSwiping.current) return;
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    animationFrameId.current = requestAnimationFrame(() => {
      const deltaX = clientX - startX.current;
      totalMoved.current += Math.abs(clientX - currentX.current);
      currentX.current = clientX;
      applySwipeStyles(deltaX);

      if (Math.abs(deltaX) > 80) { // Increased threshold for manual swipe to distinguish from jitter
        handleEnd();
      }
    });
  }, [applySwipeStyles, handleEnd]);

  const triggerAutoSwipe = useCallback(() => {
    if (isSwiping.current) return;
    
    const duration = getDurationFromCSS('--card-swap-duration', cardStackRef.current);
    const card = getActiveCard();
    
    if (card) {
      card.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
      const direction = Math.random() > 0.5 ? 1 : -1;
      
      card.style.setProperty('--swipe-x', `${direction * 300}px`);
      card.style.setProperty('--swipe-rotate', `${direction * 20}deg`);
      
      setTimeout(() => {
        setCardOrder(prev => [...prev.slice(1), prev[0]]);
      }, duration);
    }
  }, [getActiveCard, getDurationFromCSS]);

  useEffect(() => {
    if (!autoPlay || isSwiping.current) return;
    
    const timer = setInterval(() => {
      if (!isSwiping.current) {
        triggerAutoSwipe();
      }
    }, autoPlayInterval);
    
    return () => clearInterval(timer);
  }, [autoPlay, autoPlayInterval, triggerAutoSwipe]);

  useEffect(() => {
    const cardStackElement = cardStackRef.current;
    if (!cardStackElement) return;

    const handlePointerDown = (e: PointerEvent) => handleStart(e.clientX);
    const handlePointerMove = (e: PointerEvent) => handleMove(e.clientX);
    const handlePointerUp = () => handleEnd();

    cardStackElement.addEventListener('pointerdown', handlePointerDown);
    cardStackElement.addEventListener('pointermove', handlePointerMove);
    cardStackElement.addEventListener('pointerup', handlePointerUp);
    cardStackElement.addEventListener('pointercancel', handlePointerUp);

    return () => {
      cardStackElement.removeEventListener('pointerdown', handlePointerDown);
      cardStackElement.removeEventListener('pointermove', handlePointerMove);
      cardStackElement.removeEventListener('pointerup', handlePointerUp);
      cardStackElement.removeEventListener('pointercancel', handlePointerUp);

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [handleStart, handleMove, handleEnd]);

  useEffect(() => {
    updatePositions();
  }, [cardOrder, updatePositions]);

  return (
    <section
      className={`relative flex place-content-center select-none ${className}`}
      ref={cardStackRef}
      style={{
        width: cardWidth + 32,
        height: cardHeight + 32,
        touchAction: 'none',
        transformStyle: 'preserve-3d',
        '--card-perspective': '700px',
        '--card-z-offset': '12px',
        '--card-y-offset': '7px',
        '--card-max-z-index': imageList.length.toString(),
        '--card-swap-duration': '0.3s',
      } as React.CSSProperties}
    >
      {cardOrder.map((originalIndex, displayIndex) => (
        <article
          key={`${imageList[originalIndex]}-${originalIndex}`}
          className="image-card absolute cursor-grab active:cursor-grabbing
                     place-self-center border-2 border-gold-primary/30 rounded-2xl
                     shadow-2xl overflow-hidden will-change-transform bg-forest"
          style={{
            '--i': (displayIndex + 1).toString(),
            zIndex: imageList.length - displayIndex,
            width: cardWidth,
            height: cardHeight,
            transform: `perspective(var(--card-perspective))
                       translateZ(calc(-1 * var(--card-z-offset) * var(--i)))
                       translateY(calc(var(--card-y-offset) * var(--i)))
                       translateX(var(--swipe-x, 0px))
                       rotateY(var(--swipe-rotate, 0deg))`
          } as React.CSSProperties}
          onClick={() => {
            if (totalMoved.current < 10 && onCardClick) {
              onCardClick(originalIndex);
            }
          }}
        >
          <img
            src={imageList[originalIndex]}
            alt={`Swiper image ${originalIndex + 1}`}
            className="w-full h-full object-cover select-none pointer-events-none"
            draggable={false}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
        </article>
      ))}
      
      {/* Improved Visual Cue */}
      <div className="absolute -bottom-10 left-0 right-0 text-center pointer-events-none">
        <span className="text-cream text-[12px] font-bold uppercase tracking-[0.2em] animate-pulse drop-shadow-md">
          Swipe <span className="text-gold-primary">to explore</span>
        </span>
      </div>
    </section>
  );
};
