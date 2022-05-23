import { render, screen } from '@testing-library/react';
import App from './App';

test('Header renders with correct text', () => {
  render(<App />);
  const linkElement = screen.getByTestId("header");
  expect(linkElement).toBeInTheDocument("Pokemon Application");
});
