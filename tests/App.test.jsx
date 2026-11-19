import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import App from '../src/App';

describe('App Smoke Test', () => {
  it('affiche le titre principal de FactoryFlow', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    expect(screen.getByText(/FactoryFlow - Interface Industrielle/i)).toBeInTheDocument();
  });
});
