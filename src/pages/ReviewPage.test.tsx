import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import ReviewPage from './ReviewPage';

describe('ReviewPage', () => {
  it('shows the schema message and sends no request for an invalid form', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ReviewPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await user.click(
      screen.getByRole('button', { name: 'Review my project' }),
    );

    expect(
      await screen.findByText(
        'Describe your project in at least 20 characters.',
      ),
    ).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();

    queryClient.clear();
  });
});
