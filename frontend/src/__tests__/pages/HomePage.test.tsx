import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import HomePage from '../../pages/HomePage';

describe('HomePage', () => {
  it('should render without crashing', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Clarify/i)).toBeInTheDocument();
  });

  it('should display hero section', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    const heroElements = screen.getAllByText(/Clarify/i);
    expect(heroElements.length).toBeGreaterThan(0);
  });
});
