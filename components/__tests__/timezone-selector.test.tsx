import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TimezoneSelector } from '../timezone-selector';
import { TimezoneProvider } from '@/lib/hooks/useTimezones';

// Mock the useTimezones hook
jest.mock('@/lib/hooks/useTimezones', () => ({
  ...jest.requireActual('@/lib/hooks/useTimezones'),
  useTimezones: () => ({
    availableTimezones: [
      {
        id: '1',
        timezone_id: 'America/New_York',
        city: 'New York',
        country_name: 'United States',
        country_code: 'US',
        utc_offset: '-05:00',
        display_name: 'New York (EST/EDT)',
        popular: true,
        is_dst: false,
      },
      {
        id: '2',
        timezone_id: 'Europe/London',
        city: 'London',
        country_name: 'United Kingdom',
        country_code: 'GB',
        utc_offset: '+00:00',
        display_name: 'London (GMT/BST)',
        popular: true,
        is_dst: false,
      },
      {
        id: '3',
        timezone_id: 'Asia/Tokyo',
        city: 'Tokyo',
        country_name: 'Japan',
        country_code: 'JP',
        utc_offset: '+09:00',
        display_name: 'Tokyo (JST)',
        popular: true,
        is_dst: false,
      },
    ],
    selectedTimezones: [],
    addTimezone: jest.fn(),
    searchTimezones: jest.fn((query: string) => [
      {
        id: '1',
        timezone_id: 'America/New_York',
        city: 'New York',
        country_name: 'United States',
        country_code: 'US',
        utc_offset: '-05:00',
        display_name: 'New York (EST/EDT)',
        popular: true,
        is_dst: false,
      },
    ]),
    downloadMoreTimezones: jest.fn(),
  }),
}));

describe('TimezoneSelector', () => {
  it('renders the dialog when open prop is true', async () => {
    render(<TimezoneSelector open={true} onOpenChange={jest.fn()} />);

    // Check if the dialog title is rendered
    await waitFor(() => {
      expect(screen.getByText('Add Timezone')).toBeInTheDocument();
    });

    // Check if the search input is rendered
    expect(
      screen.getByPlaceholderText('Search by city, country, or timezone...')
    ).toBeInTheDocument();
  });

  it('displays popular timezones when no search query', async () => {
    render(<TimezoneSelector open={true} onOpenChange={jest.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('Popular Timezones')).toBeInTheDocument();
    });

    // Check if timezone count is displayed
    expect(screen.getByText(/3 timezones/i)).toBeInTheDocument();

    // Check if popular timezones are rendered
    expect(screen.getByText('New York (EST/EDT)')).toBeInTheDocument();
    expect(screen.getByText('London (GMT/BST)')).toBeInTheDocument();
    expect(screen.getByText('Tokyo (JST)')).toBeInTheDocument();
  });

  it('filters timezones when searching', async () => {
    render(<TimezoneSelector open={true} onOpenChange={jest.fn()} />);

    const searchInput = screen.getByPlaceholderText(
      'Search by city, country, or timezone...'
    );

    // Type in the search input
    fireEvent.change(searchInput, { target: { value: 'New York' } });

    await waitFor(() => {
      expect(screen.getByText('Search Results')).toBeInTheDocument();
    });

    // Should show filtered results
    expect(screen.getByText('New York (EST/EDT)')).toBeInTheDocument();
  });

  it('shows download button with tooltip', async () => {
    render(<TimezoneSelector open={true} onOpenChange={jest.fn()} />);

    await waitFor(() => {
      // The download button should be present
      const downloadButtons = screen.getAllByRole('button');
      const downloadButton = downloadButtons.find(
        (btn) => btn.querySelector('svg') && !btn.textContent?.includes('Add')
      );
      expect(downloadButton).toBeInTheDocument();
    });
  });

  it('displays empty state when no timezones match search', async () => {
    // Override the mock for this test
    const mockSearchTimezones = jest.fn(() => []);
    
    jest.spyOn(require('@/lib/hooks/useTimezones'), 'useTimezones').mockReturnValue({
      availableTimezones: [],
      selectedTimezones: [],
      addTimezone: jest.fn(),
      searchTimezones: mockSearchTimezones,
      downloadMoreTimezones: jest.fn(),
    });

    render(<TimezoneSelector open={true} onOpenChange={jest.fn()} />);

    const searchInput = screen.getByPlaceholderText(
      'Search by city, country, or timezone...'
    );

    fireEvent.change(searchInput, { target: { value: 'NonExistentCity' } });

    await waitFor(() => {
      expect(screen.getByText('No timezones found')).toBeInTheDocument();
    });

    // Check for helpful suggestions
    expect(screen.getByText('Try a different search')).toBeInTheDocument();
    expect(screen.getByText('Download more timezones')).toBeInTheDocument();
  });
});

