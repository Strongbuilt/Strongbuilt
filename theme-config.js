tailwind.config = {
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#231F20',
          dark: '#1a1718',
          gold: '#FCB615',
          darkGold: '#C8900F',
          lightGold: '#FFD56B',
          gray: '#4A4A4A',
          silver: '#C0C0C0',
        },
        clay: {
          base: '#231F20',
          mist: '#1a1718',
          sunken: '#15110f',
          paper: '#2a2627',
          surface: '#ffffff',
          ink: '#f5f1ec',
          muted: '#b8b2a8',
          faint: '#8a857d',
          border: 'rgba(255, 255, 255, 0.10)',
        }
      },
      spacing: {
        '18': '4.5rem',
      },
      fontFamily: {
        hero: ['"Agency FB"', '"Barlow Condensed"', 'Impact', 'Helvetica', 'Arial', 'sans-serif'],
        heading: ['"Barlow Condensed"', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['Archivo', 'Helvetica', 'sans-serif'],
        body: ['Inter', 'Helvetica', 'Arial', 'sans-serif'],
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
          '0%, 100%': { boxShadow: '0 0 5px #FCB615, 0 0 10px #FCB615' },
          '50%': { boxShadow: '0 0 20px #FCB615, 0 0 30px #C8900F' },
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
