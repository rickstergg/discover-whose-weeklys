const getArtistsAndNames = (songList) => {
  return songList.map(({ image, owner, track: { name, artists } }) => {
    return {
      image,
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

// Taken from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
const shuffle = (array) => {
  var index = array.length, temp, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== index) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * index);
    index -= 1;

    // And swap it with the current element.
    temp = array[index];
    array[index] = array[randomIndex];
    array[randomIndex] = temp;
  }

  return array;
}

module.exports = {
  getArtistsAndNames,
  playlistIdMap,
  lookUpOwner,
  shuffle,
}
