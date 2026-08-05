import { render, screen } from '@testing-library/react';
import App from './App';

test('renders LoveCrafted app without crashing', () => {
  render(<App />);
  const brandElement = screen.getByText(/LoveCrafted/i);
  expect(brandElement).toBeInTheDocument();
});
