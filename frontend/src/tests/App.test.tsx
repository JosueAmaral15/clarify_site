import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    
    expect(document.body).toBeInTheDocument();
  });

  it('renders navigation', () => {
    render(<App />);
    
    // Check if main element exists
    const main = document.querySelector('main');
    expect(main).toBeInTheDocument();
  });
});
