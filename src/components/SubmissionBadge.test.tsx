import { render, screen } from '@testing-library/react';
import type { ComponentProps } from 'react';
import { describe, expect, it } from 'vitest';
import SubmissionBadge from './SubmissionBadge';

describe('SubmissionBadge', () => {
  it('shows the status supplied by its submission', () => {
    const submission: ComponentProps<typeof SubmissionBadge>['submission'] = {
      id: 1,
      status: 'Submitted',
    };

    render(<SubmissionBadge submission={submission} />);

    expect(screen.getByText('Submitted')).toBeInTheDocument();
  });
});
