const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static('public'));
let songs = [
    { id: 1, title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', duration: '3:20', coverUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e6/The_Weeknd_-_Blinding_Lights.png' },
    { id: 2, title: 'Starboy', artist: 'The Weeknd', album: 'Starboy', duration: '3:50', coverUrl: 'https://upload.wikimedia.org/wikipedia/en/3/39/The_Weeknd_-_Starboy.png' },
    { id: 3, title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', duration: '3:23', coverUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f5/Dua_Lipa_-_Levitating.png' }
];

app.get('/api/songs', (req, res) => {
    res.json(songs);
});

app.post('/api/songs', (req, res) => {
    const { title, artist, album, duration, coverUrl } = req.body;
    
    if (!title || !artist) {
        return res.status(400).json({ error: 'Title and Artist are required' });
    }

    const newSong = {
        id: Date.now(),
        title,
        artist,
        album: album || 'Unknown Album',
        duration: duration || '0:00',
        coverUrl: coverUrl || 'https:/.placeholder.com/150'
    };

    songs.push(newSong);
    res.status(201).json(newSong);
});

app.delete('/api/songs/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = songs.findIndex(s => s.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Song not found' });
    }

    songs.splice(index, 1);
    res.status(204).send();
});

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
