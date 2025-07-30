const gradients = {
  primary: ['#00A89D', '#6FD9D1'],
  secondary: ['#1B1B1B', '#2F2F2F'],
  accent: ['#A9EAE7', '#D0F6F4'],
  energy: ['#00A89D', '#A9EAE7', '#6FD9D1'],
  challenge: ['#0F4E4D', '#00A89D', '#6FD9D1'],
  dark: ['#0B0D10', '#1C1E22', '#2A2D33'],
} as const;

export type Gradients = typeof gradients;
export { gradients };
