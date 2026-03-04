import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AddTrack from '../pages/AddTrack';
import { createSong } from '../api';

// Mock the API service
vi.mock('../api', () => ({
  createSong: vi.fn()
}));

// Mock react-router useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('AddTrack Page Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setup = () => render(
    <MemoryRouter>
      <AddTrack />
    </MemoryRouter>
  );

  it('renders correctly', () => {
    setup();
    expect(screen.getByRole('heading', { name: /add new track/i })).toBeInTheDocument();
  });

  it('shows error if submitting empty required fields', async () => {
    setup();
    
    // Trigger submit directly on the form to bypass jsdom native required blocker
    const form = screen.getByRole('button', { name: /add to library/i }).closest('form');
    fireEvent.submit(form);

    expect(await screen.findByText('Title and Artist are required.')).toBeInTheDocument();
  });

  it('calls createSong and navigates on successful submit', async () => {
    createSong.mockResolvedValue({ _id: '123' });
    setup();

    fireEvent.change(screen.getByLabelText(/song title \*/i), { target: { value: 'Test Title' } });
    fireEvent.change(screen.getByLabelText(/artist \*/i), { target: { value: 'Test Artist' } });
    fireEvent.change(screen.getByLabelText(/album/i), { target: { value: 'Test Album' } });

    const submitBtn = screen.getByRole('button', { name: /add to library/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(createSong).toHaveBeenCalledWith({
        title: 'Test Title',
        artist: 'Test Artist',
        album: 'Test Album',
        duration: '',
        coverUrl: ''
      });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('shows generic error if API fails', async () => {
    createSong.mockRejectedValue(new Error('API failed'));
    setup();

    fireEvent.change(screen.getByLabelText(/song title \*/i), { target: { value: 'Test Title' } });
    fireEvent.change(screen.getByLabelText(/artist \*/i), { target: { value: 'Test Artist' } });

    const submitBtn = screen.getByRole('button', { name: /add to library/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Failed to add song. Please try again.')).toBeInTheDocument();
    });
  });

});
