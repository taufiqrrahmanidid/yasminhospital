import React, { useState, useEffect } from 'react';

/**
 * Normalizes and URL-encodes image sources so that filenames with spaces,
 * special characters, or full domain prefixes load reliably across all browser environments.
 */
export function getImgUrl(src: string | undefined | null, fallback = '/assets/images/utama/logo_rsyasminbwi.png'): string {
  if (!src || typeof src !== 'string' || src.trim() === '') {
    return fallback;
  }
  let clean = src.trim();

  // If URL includes full domain pointing to assets, extract relative /assets/... path
  const assetsIdx = clean.indexOf('/assets/');
  if (assetsIdx !== -1) {
    clean = clean.substring(assetsIdx);
  }

  // Ensure leading slash if relative assets path
  if (clean.startsWith('assets/')) {
    clean = '/' + clean;
  }

  // Encode spaces and special characters (%20) for browser URL compliance
  try {
    return encodeURI(clean);
  } catch (e) {
    return clean;
  }
}

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

/**
 * SafeImage component with automatic fallback handling on image load error
 */
export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  fallbackSrc = '/assets/images/utama/logo_rsyasminbwi.png',
  alt = '',
  className,
  onError,
  ...props
}) => {
  const primaryUrl = getImgUrl(src as string, fallbackSrc);
  const [currentSrc, setCurrentSrc] = useState<string>(primaryUrl);
  const [failed, setFailed] = useState<boolean>(false);

  useEffect(() => {
    setCurrentSrc(getImgUrl(src as string, fallbackSrc));
    setFailed(false);
  }, [src, fallbackSrc]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!failed) {
      setFailed(true);
      setCurrentSrc(getImgUrl(fallbackSrc));
    }
    if (onError) {
      onError(e);
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};
