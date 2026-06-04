import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Component', () => {
  it('renders the header correctly', () => {
    render(<App />);
    expect(screen.getByText('Customer Churn Prediction')).toBeDefined();
  });

  it('shows error if numerical fields are empty and form is submitted', () => {
    // Override window.alert for test
    const originalAlert = window.alert;
    let alertMessage = '';
    window.alert = (msg) => { alertMessage = msg; };

    render(<App />);
    
    // Clear numerical fields
    const tenureInput = screen.getAllByRole('textbox').find(el => el.name === 'tenure' || el.type === 'text');
    if (tenureInput) {
       fireEvent.change(tenureInput, { target: { value: '' } });
    }

    // Click analyze button
    const button = screen.getByText('Analyze Risk');
    fireEvent.click(button);

    // Should alert to fill numerical fields
    expect(alertMessage).toContain('Please fill all numerical fields');
    
    window.alert = originalAlert;
  });
});
