const getArtistsAndNames = (songList) => {
  return songList.map(({ owner, track: { name, artists } }) => {
    return {
      name,
      artists: artists.map(artist => artist.name).join(', '),
      owner,
    };
  });
}

const lookUpOwner = (id) => {
  return playlistIdMap[id] || 'unknown';
}

// We know whose is whose, so we can use these IDs to reverse link the songs coming back from the API
const playlistIdMap = {
  '37i9dQZEVXcNbkdjqiBYAa': 'Rick',  // Rick
  '37i9dQZEVXcPAHESJrxEYO': 'Elisa', // Elisa
  '37i9dQZEVXcPt6vVrR5lta': 'Pango', // Pango
  '37i9dQZEVXcFM6piYkUYgR': 'Viv',   // Viv
};

module.exports = {
  getArtistsAndNames,
  playlistIdMap,
  lookUpOwner,
}
