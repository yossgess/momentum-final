const gradients = {
  primary: ['#FDBA52', '#FED485'],
  secondary: ['#4855A4', '#6B76B8'],
  accent: ['#2A9CDA', '#5BB3E3'],
  energy: ['#FDBA52', '#2A9CDA', '#5BB3E3'],
  challenge: ['#4855A4', '#FDBA52', '#FED485'],
  dark: ['#0F1F4A', '#1A2332', '#243041'],
  sunset: ['#FDBA52', '#E5A03D', '#CC8A2B'],
  ocean: ['#2A9CDA', '#4855A4', '#3A4485'],
} as const;

export type Gradients = typeof gradients;
export { gradients };
