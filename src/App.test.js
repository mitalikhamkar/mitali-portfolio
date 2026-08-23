import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the hero heading with the site owner name', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { level: 1 });
  expect(heading).toHaveTextContent(/Mitali/i);
});
