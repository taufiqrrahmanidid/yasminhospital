/**
 * Background Environment & Device Detector Module
 * Checks OS, Browser, Screen Resolution, Device Pixel Ratio, and Touch capabilities.
 * Applies CSS classes and font/layout normalization scripts matching Windows OS rendering baselines
 * to prevent layout shifts across Android, iOS, macOS, and Linux tablets/mobiles.
 */

export interface DeviceEnvironment {
  os: 'Windows' | 'Android' | 'iOS' | 'macOS' | 'Linux' | 'ChromeOS' | 'Unknown';
  browser: 'Chrome' | 'Edge' | 'Safari' | 'Firefox' | 'Samsung' | 'Opera' | 'Unknown';
  deviceType: 'desktop' | 'tablet' | 'mobile';
  screenWidth: number;
  screenHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  devicePixelRatio: number;
  isTouch: boolean;
  isDesktopViewOnMobile: boolean;
}

export function detectDeviceEnvironment(): DeviceEnvironment {
  const ua = navigator.userAgent || '';
  const platform = (navigator as unknown as { userAgentData?: { platform?: string } }).userAgentData?.platform || navigator.platform || '';

  // 1. Detect Operating System
  let os: DeviceEnvironment['os'] = 'Unknown';
  if (/win/i.test(platform) || /windows/i.test(ua)) {
    os = 'Windows';
  } else if (/android/i.test(ua)) {
    os = 'Android';
  } else if (/iphone|ipad|ipod/i.test(ua) || (platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
    os = 'iOS';
  } else if (/mac/i.test(platform) || /macintosh/i.test(ua)) {
    os = 'macOS';
  } else if (/cros/i.test(ua)) {
    os = 'ChromeOS';
  } else if (/linux/i.test(platform) || /linux/i.test(ua)) {
    os = 'Linux';
  }

  // 2. Detect Browser Type
  let browser: DeviceEnvironment['browser'] = 'Unknown';
  if (/edg/i.test(ua)) {
    browser = 'Edge';
  } else if (/samsungbrowser/i.test(ua)) {
    browser = 'Samsung';
  } else if (/opr|opera/i.test(ua)) {
    browser = 'Opera';
  } else if (/chrome|crios|crmo/i.test(ua)) {
    browser = 'Chrome';
  } else if (/firefox|fxios/i.test(ua)) {
    browser = 'Firefox';
  } else if (/safari/i.test(ua) && !/chrome|crios|crmo/i.test(ua)) {
    browser = 'Safari';
  }

  // 3. Screen Dimensions & Viewport
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const devicePixelRatio = window.devicePixelRatio || 1;
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // 4. Device Category
  const minDim = Math.min(viewportWidth, viewportHeight);
  const maxDim = Math.max(viewportWidth, viewportHeight);
  let deviceType: DeviceEnvironment['deviceType'] = 'desktop';

  if (os === 'Android' || os === 'iOS') {
    if (minDim >= 600 || (maxDim >= 900 && minDim >= 500)) {
      deviceType = 'tablet';
    } else {
      deviceType = 'mobile';
    }
  } else if (isTouch && viewportWidth <= 1024) {
    deviceType = viewportWidth <= 640 ? 'mobile' : 'tablet';
  }

  // Check if desktop mode is requested on a mobile device
  const isDesktopViewOnMobile = (os === 'Android' || os === 'iOS') && viewportWidth >= 980;

  return {
    os,
    browser,
    deviceType,
    screenWidth,
    screenHeight,
    viewportWidth,
    viewportHeight,
    devicePixelRatio,
    isTouch,
    isDesktopViewOnMobile,
  };
}

/**
 * Normalizes Font & Layout Settings across Android/iOS/other platforms
 * based on Windows Desktop baseline layout rules.
 */
export function initDeviceEnvironmentAndFontNormalization(): DeviceEnvironment {
  const env = detectDeviceEnvironment();
  const htmlEl = document.documentElement;

  // Set dataset & CSS helper classes on <html> element
  htmlEl.dataset.os = env.os.toLowerCase();
  htmlEl.dataset.browser = env.browser.toLowerCase();
  htmlEl.dataset.device = env.deviceType;
  htmlEl.dataset.dpr = Math.round(env.devicePixelRatio).toString();

  // Add specific classes to root
  const classesToAdd = [
    `os-${env.os.toLowerCase()}`,
    `browser-${env.browser.toLowerCase()}`,
    `device-${env.deviceType}`,
    'layout-normalized-windows',
  ];

  classesToAdd.forEach((cls) => htmlEl.classList.add(cls));

  // Expose environment metadata on window for diagnostic access
  (window as unknown as { __DEVICE_ENV__?: DeviceEnvironment }).__DEVICE_ENV__ = env;

  // Apply Font & Screen Resolution Adaptation relative to Windows standard
  applyWindowsFontBaselineAdaptation(env);

  // Re-evaluate on orientation or window resize
  let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
  window.addEventListener('resize', () => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const updatedEnv = detectDeviceEnvironment();
      applyWindowsFontBaselineAdaptation(updatedEnv);
    }, 150);
  });

  return env;
}

/**
 * Calculates and enforces font size, line-height normalization, and
 * viewport scaling so Android/iOS mobile & tablet displays match Windows typography proportions.
 */
function applyWindowsFontBaselineAdaptation(env: DeviceEnvironment) {
  const htmlEl = document.documentElement;

  // 1. Lock text size adjust to prevent Android Chrome/Samsung Browser font boosting
  htmlEl.style.webkitTextSizeAdjust = '100%';
  (htmlEl.style as unknown as { textSizeAdjust: string }).textSizeAdjust = '100%';

  // 2. Adjust root font size to scale rem units consistently with Windows standard (16px base)
  // If user is on an Android tablet viewing in desktop view or tablet mode, normalize scaling
  if (env.os === 'Android' || env.os === 'iOS') {
    if (env.deviceType === 'tablet') {
      // Android tablets often render system fonts slightly larger due to display DPI
      // Normalizing root font size ensures text doesn't overflow or wrap unnaturally
      htmlEl.style.fontSize = '16px';
    } else if (env.isDesktopViewOnMobile) {
      // Request Desktop Site mode on mobile
      htmlEl.style.fontSize = '15px';
    } else {
      htmlEl.style.fontSize = '16px';
    }
  } else {
    htmlEl.style.fontSize = '16px';
  }
}
