const getArtistsAndNames = (songList) => {
  return songList.map(({ track: { name, artists } }) => {
    return {
      name,
      artists: artists.map(artist => artist.name).join(', '),
    };
  });
}

module.exports = {
  getArtistsAndNames,
}
