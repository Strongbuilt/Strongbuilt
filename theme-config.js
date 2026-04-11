tailwind.config = {
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#0a0a0a',
          dark: '#050505',
          gold: '#FFD700',
          darkGold: '#C5A000',
          lightGold: '#FFE566',
          gray: '#4A4A4A',
          silver: '#C0C0C0',
        }
      },
      spacing: {
        '18': '4.5rem',
      },
      fontFamily: {
        heading: ['Oswald', 'sans-serif'],
        body: ['Outfit', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'noise': "url('https://www.transparenttextures.com/patterns/stardust.png')",
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'float-delayed': 'float 8s ease-in-out 4s infinite',
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'glow-pulse': 'glow 3s ease-in-out infinite',
        'scroll': 'scroll 30s linear infinite',
        'ken-burns': 'kenBurns 20s ease-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px #FFD700, 0 0 10px #FFD700' },
          '50%': { boxShadow: '0 0 20px #FFD700, 0 0 30px #B8860B' },
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        kenBurns: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.15)' },
        }
      }
    }
  }
}
