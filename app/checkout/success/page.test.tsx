import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SuccessPage from './page';

// Mock the client used inside Suspense
jest.mock('./success-client', () => ({
  __esModule: true,
  default: () => <div data-testid="success-client">SuccessClient</div>,
}));

describe('SuccessPage', () => {
  it('renders SuccessClient inside Suspense', () => {
    render(<SuccessPage />);
    expect(screen.getByTestId('success-client')).toBeInTheDocument();
  });
});