/**
 * QR Code Generator - 100% Free, No External Dependencies
 * Uses locally installed qrcode library only
 */

import QRCode from 'qrcode';

class QRCodeSystem {
  constructor() {
    this.currentUrl = '';
    this.validationTimeout = null;
    this.canvas = null;
    this.isValidating = false;
    
    // Security patterns for URL validation - 100% FREE
    this.MALICIOUS_PATTERNS = [
      /javascript:/i,
      /data:/i,
      /vbscript:/i,
      /file:/i,
      /ftp:/i,
      /<script/i,
      /eval\(/i,
      /\.exe$/i,
      /\.bat$/i,
      /\.cmd$/i,
      /\.scr$/i,
      /localhost/i,
      /127\.0\.0\.1/i,
      /0\.0\.0\.0/i,
      /::1/i
    ];

    this.SUSPICIOUS_TLD = [
      '.tk', '.ml', '.ga', '.cf', '.download', '.zip', '.exe'
    ];

    this.init();
  }

  init() {
    this.canvas = document.getElementById('qr-canvas');
    this.bindEvents();
  }

  bindEvents() {
    // Listen for custom URL input changes
    document.addEventListener('qr-url-change', (event) => {
      this.handleUrlChange(event.detail.url);
    });

    // Download buttons
    document.querySelectorAll('.download-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const button = e.target.closest('.download-btn');
        const format = button?.dataset?.format;
        if (format) {
          this.downloadQRCode(format);
        }
      });
    });
  }

  async handleUrlChange(url) {
    const trimmedUrl = url.trim();
    
    // Clear previous timeout
    if (this.validationTimeout) {
      clearTimeout(this.validationTimeout);
    }

    // Reset state if URL is empty
    if (!trimmedUrl) {
      this.resetQRDisplay();
      return;
    }

    // Set loading state immediately for better UX
    this.setLoadingState();

    // Debounce validation by 800ms for better UX
    this.validationTimeout = setTimeout(async () => {
      await this.validateAndGenerateQR(trimmedUrl);
    }, 800);
  }

  async validateAndGenerateQR(url) {
    this.isValidating = true;

    try {
      // Step 1: Basic URL format validation
      if (!this.isValidUrlFormat(url)) {
        throw new Error('Invalid URL format');
      }

      // Step 2: Security checks
      if (!this.passesSecurityChecks(url)) {
        throw new Error('URL contains potentially malicious content');
      }

      // Step 3: Advanced validation
      const validatedUrl = await this.performAdvancedValidation(url);

      // Step 4: Generate QR code using locally installed library
      await this.generateQRCode(validatedUrl);
      
      this.setSuccessState(validatedUrl);

    } catch (error) {
      this.setErrorState(error.message || 'URL validation failed');
    } finally {
      this.isValidating = false;
    }
  }

  isValidUrlFormat(url) {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }

  passesSecurityChecks(url) {
    // Check against malicious patterns
    for (const pattern of this.MALICIOUS_PATTERNS) {
      if (pattern.test(url)) {
        return false;
      }
    }

    // Check suspicious TLDs
    for (const tld of this.SUSPICIOUS_TLD) {
      if (url.toLowerCase().includes(tld)) {
        return false;
      }
    }

    // Check for suspicious URL shorteners or redirects
    const suspiciousShorteners = [
      'bit.ly', 'tinyurl.com', 't.co', 'short.link', 'tiny.cc'
    ];
    
    for (const shortener of suspiciousShorteners) {
      if (url.toLowerCase().includes(shortener)) {
        console.warn(`URL shortener detected: ${shortener}. Proceeding with caution.`);
      }
    }

    return true;
  }

  performAdvancedValidation(url) {
    return new Promise((resolve, reject) => {
      // Completely FREE - no external services
      setTimeout(() => {
        try {
          const urlObj = new URL(url);
          
          // Additional security checks
          if (urlObj.hostname.length > 253) {
            reject(new Error('Hostname too long'));
            return;
          }

          if (urlObj.pathname.length > 2048) {
            reject(new Error('URL path too long'));
            return;
          }

          // Check for common phishing indicators
          const phishingPatterns = [
            /paypal.*verify/i,
            /amazon.*security/i,
            /apple.*id.*suspend/i,
            /microsoft.*account.*verify/i,
            /google.*security.*alert/i
          ];

          for (const pattern of phishingPatterns) {
            if (pattern.test(url)) {
              reject(new Error('URL resembles known phishing pattern'));
              return;
            }
          }

          resolve(url);
        } catch (error) {
          reject(new Error('Advanced validation failed'));
        }
      }, 500); // Simulate network delay
    });
  }

  async generateQRCode(url) {
    if (!this.canvas) {
      throw new Error('Canvas not available');
    }

    try {
      // Use locally installed QRCode library - 100% FREE
      await QRCode.toCanvas(this.canvas, url, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });

      this.currentUrl = url;
    } catch (error) {
      throw new Error('Failed to generate QR code');
    }
  }

  downloadQRCode(format) {
    if (!this.canvas || !this.currentUrl) {
      return;
    }

    const link = document.createElement('a');
    const filename = `qr-code-${Date.now()}`;

    try {
      switch (format.toLowerCase()) {
        case 'png':
          link.download = `${filename}.png`;
          link.href = this.canvas.toDataURL('image/png');
          break;
        
        case 'jpg':
          link.download = `${filename}.jpg`;
          link.href = this.canvas.toDataURL('image/jpeg', 0.9);
          break;
        
        case 'svg':
          // Generate SVG version using local library
          this.downloadSVGQRCode(filename);
          return;
        
        default:
          throw new Error('Unsupported format');
      }

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
    }
  }

  async downloadSVGQRCode(filename) {
    try {
      const svgString = await QRCode.toString(this.currentUrl, {
        type: 'svg',
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.download = `${filename}.svg`;
      link.href = url;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('SVG download failed:', error);
    }
  }

  setLoadingState() {
    this.hideAllStates();
    document.getElementById('qr-loading')?.classList.remove('hidden');
    this.updateStatus('validating', 'Validating URL...');
  }

  setSuccessState(url) {
    this.hideAllStates();
    document.getElementById('qr-canvas')?.classList.remove('hidden');
    document.getElementById('download-section')?.classList.remove('hidden');
    document.getElementById('url-info')?.classList.remove('hidden');
    
    const verifiedUrlEl = document.getElementById('verified-url');
    if (verifiedUrlEl) {
      verifiedUrlEl.textContent = url;
    }
    
    this.updateStatus('success', 'QR code generated');
  }

  setErrorState(message) {
    this.hideAllStates();
    document.getElementById('qr-error')?.classList.remove('hidden');
    
    const errorMessageEl = document.getElementById('error-message');
    if (errorMessageEl) {
      errorMessageEl.textContent = message;
    }
    
    this.updateStatus('error', 'Validation failed');
  }

  resetQRDisplay() {
    this.hideAllStates();
    document.getElementById('qr-placeholder')?.classList.remove('hidden');
    this.updateStatus('default', 'Enter URL to generate');
    this.currentUrl = '';
  }

  hideAllStates() {
    document.getElementById('qr-placeholder')?.classList.add('hidden');
    document.getElementById('qr-loading')?.classList.add('hidden');
    document.getElementById('qr-canvas')?.classList.add('hidden');
    document.getElementById('qr-error')?.classList.add('hidden');
    document.getElementById('download-section')?.classList.add('hidden');
    document.getElementById('url-info')?.classList.add('hidden');
  }

  updateStatus(type, text) {
    const indicator = document.getElementById('status-indicator');
    const statusText = document.getElementById('status-text');
    
    if (indicator && statusText) {
      indicator.className = 'w-2 h-2 rounded-full';
      
      switch (type) {
        case 'default':
          indicator.classList.add('bg-fg/30');
          break;
        case 'validating':
          indicator.classList.add('bg-yellow-400', 'animate-pulse');
          break;
        case 'success':
          indicator.classList.add('bg-green-400');
          break;
        case 'error':
          indicator.classList.add('bg-red-400');
          break;
      }
      
      statusText.textContent = text;
    }
  }
}

// Initialize QR system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (typeof window !== 'undefined') {
    window.qrSystem = new QRCodeSystem();
  }
});

export default QRCodeSystem; 