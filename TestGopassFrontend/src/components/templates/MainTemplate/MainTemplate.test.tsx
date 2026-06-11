import { render, screen } from '@testing-library/react';
import { MainTemplate } from './MainTemplate';

jest.mock('@/components/organisms/Header/Header', () => ({
  Header: () => <div data-testid="header">Header</div>,
}));

describe('MainTemplate', () => {
  it('renders header', () => {
    render(<MainTemplate>Content</MainTemplate>);
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(<MainTemplate><div data-testid="child">Child Content</div></MainTemplate>);
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('applies correct layout classes', () => {
    render(<MainTemplate>Content</MainTemplate>);
    const main = screen.getByRole('main');
    expect(main).toHaveClass('max-w-7xl', 'mx-auto', 'px-6', 'py-8');
  });
});
