import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { searchMusic, getMusicUrl, getAlbumCover } from './services/musicApi'

function App() {
  const [musicList, setMusicList] = useState([]);
  const [coverMap, setCoverMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [playingId, setPlayingId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [search, setSearch] = useState("");
  const [audio, setAudio] = useState(null);
  const [currentMusic, setCurrentMusic] = useState(null);
  const [source, setSource] = useState('netease');
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(20);

  // 初始化音频对象
  useEffect(() => {
    const audioObj = new Audio();
    setAudio(audioObj);
    return () => {
      audioObj.pause();
      audioObj.src = '';
    };
  }, []);

  // 搜索音乐
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await searchMusic(search, source, count, page);
      let list = [];
      if (result && Array.isArray(result)) {
        list = result;
      } else if (result && Array.isArray(result.data)) {
        list = result.data;
      }
      setMusicList(list);
      // 异步获取所有专辑封面
      const coverPromises = list.map(async music => {
        if (music.pic_id) {
          const url = await getAlbumCover(music.pic_id, music.source || source, 300);
          return { id: music.id, url };
        }
        return { id: music.id, url: reactLogo };
      });
      const covers = await Promise.all(coverPromises);
      const coverObj = {};
      covers.forEach(item => { coverObj[item.id] = item.url || reactLogo; });
      setCoverMap(coverObj);
    } catch (err) {
      setError('搜索失败: ' + err.message);
      setMusicList([]);
      setCoverMap({});
    } finally {
      setLoading(false);
    }
  };

  // 播放音乐
  const handlePlay = async (music) => {
    if (!audio) return;
    setError(null);
    try {
      setLoading(true);
      // 获取播放链接
      const urlRes = await getMusicUrl(music.id, music.source || source);
      const playUrl = urlRes.url || urlRes.data?.url;
      if (!playUrl) throw new Error('未获取到播放链接');
      audio.src = playUrl;
      await audio.play();
      setPlayingId(music.id);
      setIsPlaying(true);
      setCurrentMusic(music);
    } catch (err) {
      setError('播放失败: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePause = () => {
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handlePrev = () => {
    if (!playingId) return;
    const idx = musicList.findIndex(m => m.id === playingId);
    if (idx > 0) {
      handlePlay(musicList[idx - 1]);
    }
  };

  const handleNext = () => {
    if (!playingId) return;
    const idx = musicList.findIndex(m => m.id === playingId);
    if (idx < musicList.length - 1) {
      handlePlay(musicList[idx + 1]);
    }
  };

  // 监听音频结束事件
  useEffect(() => {
    if (!audio) return;
    const handleEnded = () => {
      setIsPlaying(false);
      handleNext();
    };
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audio, musicList, playingId]);

  // 音乐源选项
  const sources = [
    'netease', 'tencent', 'kugou', 'kuwo', 'migu', 'joox', 'spotify', 'ytmusic', 'tidal', 'qobuz', 'deezer', 'ximalaya'
  ];

  return (
    <div className="music-app">
      <header className="music-header">
        <h1>🎵 音乐搜索播放器</h1>
        <p>支持多平台音乐搜索与播放</p>
      </header>
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="输入关键词（歌曲/歌手/专辑）..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={source} onChange={e => setSource(e.target.value)}>
          {sources.map(src => (
            <option key={src} value={src}>{src}</option>
          ))}
        </select>
        <button type="submit" disabled={loading}>搜索</button>
      </form>
      <section className="music-list-section">
        <h2>搜索结果</h2>
        {loading ? <div className="loading">加载中...</div> : null}
        <ul className="music-list">
          {musicList.length === 0 ? (
            <li className="music-item empty">未找到相关音乐</li>
          ) : (
            musicList.map((music) => (
              <li key={music.id} className={`music-item${playingId === music.id && isPlaying ? ' playing' : ''}`}>
                <img src={coverMap[music.id] || reactLogo} alt={music.name} className="music-cover" />
                <div className="music-info">
                  <span className="music-title">{music.name}</span>
                  <span className="music-artist">{Array.isArray(music.artist) ? music.artist.join(', ') : music.artist}</span>
                  <span className="music-album">{music.album}</span>
                </div>
                {playingId === music.id && isPlaying ? (
                  <button className="play-btn pause" onClick={handlePause}>暂停</button>
                ) : (
                  <button className="play-btn" onClick={() => handlePlay(music)}>播放</button>
                )}
              </li>
            ))
          )}
        </ul>
      </section>
      {currentMusic && (
        <div className="player-bar">
          <div className="player-info-container">
            <img src={coverMap[currentMusic?.id] || reactLogo} alt={currentMusic.name} className="player-cover" />
            <span className="player-info">{currentMusic.name} - {Array.isArray(currentMusic.artist) ? currentMusic.artist.join(', ') : currentMusic.artist}</span>
          </div>
          <div className="player-controls">
            <button className="player-btn" onClick={handlePrev} disabled={musicList.findIndex(m => m.id === playingId) === 0}>上一曲</button>
            {isPlaying ? (
              <button className="player-btn pause" onClick={handlePause}>暂停</button>
            ) : (
              <button className="player-btn play" onClick={() => handlePlay(currentMusic)}>播放</button>
            )}
            <button className="player-btn" onClick={handleNext} disabled={musicList.findIndex(m => m.id === playingId) === musicList.length - 1}>下一曲</button>
          </div>
        </div>
      )}
      {error && <div className="error">{error}</div>}
    </div>
  )
}

export default App
