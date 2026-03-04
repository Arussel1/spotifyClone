import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../pages/Home';
import { getSongs } from '../api';

// Mock the API service
vi.mock('../api', () => ({
  getSongs: vi.fn()
}));

const mockSongs = [
  {
    _id: '1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    coverUrl: 'https://test.com/img1.jpg'
  },
  {
    _id: '2',
    title: 'Levitating',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    coverUrl: 'https://test.com/img2.jpg'
  }
];

describe('Home Page Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state initially', async () => {
    // Return a promise that doesn't resolve immediately
    let resolvePromise;
    getSongs.mockReturnValue(new Promise(resolve => {
      resolvePromise = resolve;
    }));

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText(/loading your music/i)).toBeInTheDocument();
    resolvePromise(mockSongs);
  });

  it('renders songs when API call succeeds', async () => {
    getSongs.mockResolvedValue(mockSongs);

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Blinding Lights')).toBeInTheDocument();
      expect(screen.getByText('The Weeknd')).toBeInTheDocument();
      expect(screen.getByText('Levitating')).toBeInTheDocument();
      expect(screen.getByText('Dua Lipa')).toBeInTheDocument();
    });
  });

  it('shows empty state when no songs are returned', async () => {
    getSongs.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/no songs found/i)).toBeInTheDocument();
      expect(screen.getByText(/add some tracks to get started/i)).toBeInTheDocument();
    });
  });

  it('filters songs based on search input', async () => {
    getSongs.mockResolvedValue(mockSongs);

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByText('Blinding Lights')).toBeInTheDocument();
    });

    // Find and interact with search input
    const searchInput = screen.getByPlaceholderText(/search songs, artists, albums/i);
    fireEvent.change(searchInput, { target: { value: 'dua' } });

    // Verify filtering
    expect(screen.getByText('Levitating')).toBeInTheDocument();
    expect(screen.queryByText('Blinding Lights')).not.toBeInTheDocument();
  });

});
