import { render, screen } from '@testing-library/react';
import CheckoutPage from './page';

// Mock the heavy client so the page test is stable/fast
jest.mock('@/components/checkout-client', () => ({
  __esModule: true,
  default: () => <div data-testid="checkout-client">CheckoutClient</div>,
}));

describe('CheckoutPage', () => {
  it('renders CheckoutClient', () => {
    render(<CheckoutPage />);
    expect(screen.getByTestId('checkout-client')).toBeInTheDocument();
  });
});