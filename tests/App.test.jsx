import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { AuthProvider } from '../src/contexts/AuthContext';
import App from '../src/App';

describe('App Smoke Test', () => {
  it('se monte correctement à l interieur du AuthProvider', () => {
    render(
      <BrowserRouter>
        <AuthProvider>        
          <App />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByRole('button',{name: /se connecter/i})).toBeInTheDocument();
  });
});
