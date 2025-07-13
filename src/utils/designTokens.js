// Design Tokens berdasarkan context.json
export const COLORS = {
    primary: '#252734', // hsl(220 14% 16%)
    secondary: '#2A2F3A', // hsl(217.2 32.6% 17.5%)
    background: '#252734', // hsl(220 14% 16%)
    text: '#FAFBFC', // hsl(210 40% 98%)
    black: '#000000',
    white: '#FFFFFF',
    gray: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827'
    },
    accent: {
        primary: '#FF9000', // hsl(33 100% 50%)
        secondary: '#FFA726',
        tertiary: '#FFB74D'
    },
    glass: {
        background: 'rgba(37, 39, 52, 0.8)', // hsl(220 14% 16% / 0.8)
        backgroundOpacity: 0.8,
        outline: {
            color: '#2A2F3A', // hsl(217.2 32.6% 17.5%)
            width: 1,
            style: 'solid'
        },
        blur: {
            radius: 12,
            opacity: 0.8
        }
    }
};

export const TYPOGRAPHY = {
    fontFamily: {
        primary: 'Figtree, system-ui, sans-serif',
        secondary: 'Inter, system-ui, sans-serif',
        mono: 'JetBrains Mono, monospace'
    },
    fontSize: {
        xs: '0.75rem', // 12px
        sm: '0.875rem', // 14px
        base: '1rem', // 16px
        lg: '1.125rem', // 18px
        xl: '1.25rem', // 20px
        '2xl': '1.5rem', // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem', // 36px
        '5xl': '3rem', // 48px
        '6xl': '3.75rem', // 60px
        '7xl': '4.5rem', // 72px
        '8xl': '6rem', // 96px
        '9xl': '8rem' // 128px
    },
    fontWeight: {
        thin: 100,
        extraLight: 200,
        light: 300,
        normal: 400,
        medium: 500,
        semiBold: 600,
        bold: 700,
        extraBold: 800,
        black: 900
    },
    lineHeight: {
        none: 1,
        tight: 1.25,
        snug: 1.375,
        normal: 1.5,
        relaxed: 1.625,
        loose: 2
    },
    letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0em',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em'
    }
};
