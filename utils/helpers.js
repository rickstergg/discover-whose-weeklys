const getArtistsAndNames = (songList) => {
  const yolo = songList.map(song => {
    return {
      name: song.track,
      artists: song.track.artists.map(artist => artist.name).join(', '),
    };
  });

  return yolo;
}

module.exports = {
  getArtistsAndNames,
}
