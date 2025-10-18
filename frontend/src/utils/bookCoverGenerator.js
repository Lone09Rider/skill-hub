// Book Cover Generator for Skills
// Creates beautiful, book-style cover designs based on skill name and category

const colorSchemes = {
  Programming: {
    primary: '#3B82F6',
    secondary: '#1E40AF',
    accent: '#60A5FA',
    text: '#FFFFFF'
  },
  Design: {
    primary: '#EC4899',
    secondary: '#BE185D',
    accent: '#F472B6',
    text: '#FFFFFF'
  },
  Marketing: {
    primary: '#10B981',
    secondary: '#047857',
    accent: '#34D399',
    text: '#FFFFFF'
  },
  Languages: {
    primary: '#F59E0B',
    secondary: '#D97706',
    accent: '#FBBF24',
    text: '#FFFFFF'
  },
  Music: {
    primary: '#8B5CF6',
    secondary: '#7C3AED',
    accent: '#A78BFA',
    text: '#FFFFFF'
  },
  Photography: {
    primary: '#EF4444',
    secondary: '#DC2626',
    accent: '#F87171',
    text: '#FFFFFF'
  },
  Cooking: {
    primary: '#F97316',
    secondary: '#EA580C',
    accent: '#FB923C',
    text: '#FFFFFF'
  },
  Fitness: {
    primary: '#06B6D4',
    secondary: '#0891B2',
    accent: '#22D3EE',
    text: '#FFFFFF'
  },
  Writing: {
    primary: '#6366F1',
    secondary: '#4F46E5',
    accent: '#818CF8',
    text: '#FFFFFF'
  },
  Business: {
    primary: '#059669',
    secondary: '#047857',
    accent: '#10B981',
    text: '#FFFFFF'
  },
  default: {
    primary: '#6B7280',
    secondary: '#4B5563',
    accent: '#9CA3AF',
    text: '#FFFFFF'
  }
};

const bookPatterns = [
  'dots',
  'lines',
  'geometric',
  'gradient',
  'minimal',
  'vintage',
  'modern',
  'tech'
];

const fontStyles = [
  'serif',
  'sans-serif',
  'modern',
  'classic',
  'bold',
  'elegant'
];

// Generate a deterministic pattern based on skill title
const generatePattern = (title, category) => {
  const hash = title.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const patternIndex = Math.abs(hash) % bookPatterns.length;
  const fontIndex = Math.abs(hash >> 3) % fontStyles.length;
  
  return {
    pattern: bookPatterns[patternIndex],
    font: fontStyles[fontIndex],
    hash: Math.abs(hash)
  };
};

// Generate SVG cover design
export const generateBookCover = (skill) => {
  const { title, category = 'default' } = skill;
  const colors = colorSchemes[category] || colorSchemes.default;
  const { pattern, font, hash } = generatePattern(title, category);
  
  // Create unique variations based on hash
  const patternOpacity = 0.1 + (hash % 20) / 100; // 0.1 to 0.3
  const gradientAngle = hash % 360;
  const patternScale = 0.5 + (hash % 10) / 20; // 0.5 to 1.0
  
  const createPatternSVG = () => {
    switch (pattern) {
      case 'dots':
        return `
          <pattern id="dots-${hash}" patternUnits="userSpaceOnUse" width="20" height="20">
            <circle cx="10" cy="10" r="2" fill="${colors.accent}" opacity="${patternOpacity}"/>
          </pattern>
        `;
      
      case 'lines':
        return `
          <pattern id="lines-${hash}" patternUnits="userSpaceOnUse" width="10" height="10">
            <path d="M 0,5 l 10,0" stroke="${colors.accent}" stroke-width="1" opacity="${patternOpacity}"/>
          </pattern>
        `;
      
      case 'geometric':
        return `
          <pattern id="geometric-${hash}" patternUnits="userSpaceOnUse" width="30" height="30">
            <polygon points="15,2 27,15 15,28 3,15" fill="${colors.accent}" opacity="${patternOpacity}"/>
          </pattern>
        `;
      
      case 'tech':
        return `
          <pattern id="tech-${hash}" patternUnits="userSpaceOnUse" width="25" height="25">
            <rect x="5" y="5" width="15" height="15" fill="none" stroke="${colors.accent}" stroke-width="1" opacity="${patternOpacity}"/>
            <circle cx="12.5" cy="12.5" r="2" fill="${colors.accent}" opacity="${patternOpacity * 1.5}"/>
          </pattern>
        `;
      
      default:
        return `
          <pattern id="minimal-${hash}" patternUnits="userSpaceOnUse" width="40" height="40">
            <rect x="18" y="18" width="4" height="4" fill="${colors.accent}" opacity="${patternOpacity}"/>
          </pattern>
        `;
    }
  };

  const truncateTitle = (title, maxLength = 25) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  };

  const displayTitle = truncateTitle(title);
  const titleWords = displayTitle.split(' ');
  const line1 = titleWords.slice(0, Math.ceil(titleWords.length / 2)).join(' ');
  const line2 = titleWords.slice(Math.ceil(titleWords.length / 2)).join(' ');

  return `
    <svg width="200" height="280" viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bookGradient-${hash}" x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform="rotate(${gradientAngle})">
          <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
        </linearGradient>
        <linearGradient id="spineGradient-${hash}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:${colors.secondary};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colors.primary};stop-opacity:1" />
        </linearGradient>
        ${createPatternSVG()}
        <filter id="shadow-${hash}">
          <feDropShadow dx="3" dy="5" stdDeviation="3" flood-opacity="0.3"/>
        </filter>
      </defs>
      
      <!-- Book spine -->
      <rect x="0" y="0" width="8" height="280" fill="url(#spineGradient-${hash})" />
      
      <!-- Main book cover -->
      <rect x="8" y="0" width="192" height="280" fill="url(#bookGradient-${hash})" filter="url(#shadow-${hash})" />
      
      <!-- Pattern overlay -->
      <rect x="8" y="0" width="192" height="280" fill="url(#${pattern}-${hash})" />
      
      <!-- Category badge -->
      <rect x="20" y="20" width="80" height="25" rx="12" fill="${colors.accent}" opacity="0.8" />
      <text x="60" y="36" text-anchor="middle" fill="${colors.text}" font-size="10" font-weight="bold">
        ${category.toUpperCase()}
      </text>
      
      <!-- Title area -->
      <rect x="20" y="80" width="160" height="120" fill="rgba(0,0,0,0.1)" rx="8" />
      
      <!-- Title text -->
      <text x="100" y="125" text-anchor="middle" fill="${colors.text}" font-size="16" font-weight="bold" font-family="${font}">
        ${line1}
      </text>
      ${line2 ? `<text x="100" y="145" text-anchor="middle" fill="${colors.text}" font-size="16" font-weight="bold" font-family="${font}">
        ${line2}
      </text>` : ''}
      
      <!-- Decorative elements -->
      <line x1="30" y1="65" x2="170" y2="65" stroke="${colors.accent}" stroke-width="2" opacity="0.6" />
      <line x1="30" y1="215" x2="170" y2="215" stroke="${colors.accent}" stroke-width="2" opacity="0.6" />
      
      <!-- Author area (skill type) -->
      <text x="100" y="245" text-anchor="middle" fill="${colors.text}" font-size="11" opacity="0.8">
        Interactive Learning
      </text>
      
      <!-- Corner decorations -->
      <circle cx="25" cy="25" r="3" fill="${colors.accent}" opacity="0.4" />
      <circle cx="175" cy="25" r="3" fill="${colors.accent}" opacity="0.4" />
      <circle cx="25" cy="255" r="3" fill="${colors.accent}" opacity="0.4" />
      <circle cx="175" cy="255" r="3" fill="${colors.accent}" opacity="0.4" />
    </svg>
  `;
};

// Convert SVG to data URL for use in img src
export const generateBookCoverDataURL = (skill) => {
  const svgString = generateBookCover(skill);
  const encodedSvg = btoa(unescape(encodeURIComponent(svgString)));
  return `data:image/svg+xml;base64,${encodedSvg}`;
};

// Generate a simple preview for Dashboard
export const generateMiniCover = (skill) => {
  const { title, category = 'default' } = skill;
  const colors = colorSchemes[category] || colorSchemes.default;
  const { hash } = generatePattern(title, category);
  
  return `
    <svg width="60" height="80" viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="miniGradient-${hash}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="60" height="80" fill="url(#miniGradient-${hash})" rx="4" />
      <rect x="5" y="5" width="50" height="15" fill="${colors.accent}" opacity="0.3" rx="2" />
      <text x="30" y="48" text-anchor="middle" fill="${colors.text}" font-size="8" font-weight="bold">
        ${title.substring(0, 8)}...
      </text>
    </svg>
  `;
};

export const generateMiniCoverDataURL = (skill) => {
  const svgString = generateMiniCover(skill);
  const encodedSvg = btoa(unescape(encodeURIComponent(svgString)));
  return `data:image/svg+xml;base64,${encodedSvg}`;
};

export default {
  generateBookCover,
  generateBookCoverDataURL,
  generateMiniCover,
  generateMiniCoverDataURL,
  colorSchemes
};