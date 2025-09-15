/**
 * 获取专辑封面
 * @param {string} picId - 专辑图ID
 * @param {string} source - 音乐源，默认为 netease
 * @param {number} size - 图片尺寸，默认为 300
 * @returns {Promise} 专辑封面链接
 */
export const getAlbumCover = async (picId, source = 'netease', size = 300) => {
  const url = `${GD_API_BASE}?types=pic&source=${source}&id=${picId}&size=${size}`;
  try {
    const response = await axios.get(url);
    return response.data.url;
  } catch (error) {
    console.error('获取专辑封面失败:', error);
    return null;
  }
};
// src/services/musicApi.js
import axios from 'axios';

// GD Studio API 基础地址
const GD_API_BASE = 'https://music-api.gdstudio.xyz/api.php';
/**
 * 搜索音乐
 * @param {string} keyword - 搜索关键字
 * @param {string} source - 音乐源，默认为 netease
 * @param {number} count - 返回数量，默认为 20
 * @param {number} page - 页码，默认为 1
 * @returns {Promise} 搜索结果
 */
export const searchMusic = async (keyword, source = 'netease', count = 20, page = 1) => {
  const url = `${GD_API_BASE}?types=search&source=${source}&name=${encodeURIComponent(keyword)}&count=${count}&pages=${page}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('搜索音乐失败:', error);
    throw error;
  }
};

/**
 * 获取音乐播放链接
 * @param {string} id - 曲目ID
 * @param {string} source - 音乐源，默认为 netease
 * @param {number} br - 音质，默认为 999
 * @returns {Promise} 播放链接
 */
export const getMusicUrl = async (id, source = 'netease', br = 999) => {
  const url = `${GD_API_BASE}?types=url&source=${source}&id=${id}&br=${br}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('获取播放链接失败:', error);
    throw error;
  }
};

// 获取音乐榜单数据，优先本地缓存
export const fetchMusicList = async (rankType = '', forceRefresh = false) => {
  const localKey = `musicList_${rankType}`;
  if (!forceRefresh) {
    const cached = localStorage.getItem(localKey);
    if (cached) {
      try {
        const musicList = JSON.parse(cached);
        if (Array.isArray(musicList) && musicList.length > 0) {
          return musicList;
        }
      } catch (e) {
        // 本地数据解析失败，继续远程获取
      }
    }
  }

  // 本地无数据或强制刷新，远程获取
  try {
    const response = await axios.get(`${API_BASE_URL}?t=${rankType}`, {
      responseType: 'text',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    let data;
    if (typeof response.data === 'string') {
      data = JSON.parse(response.data);
    } else {
      data = response.data;
    }
    if (data.code === 200) {
      const musicList = data.data.map(song => ({
        ...song,
        url: `http://music.163.com/song/media/outer/url?id=${song.id}.mp3`
      }));
      // 更新本地缓存
      localStorage.setItem(localKey, JSON.stringify(musicList));
      return musicList;
    } else {
      throw new Error(data.msg || '获取音乐列表失败');
    }
  } catch (error) {
    console.error('获取音乐列表时出错:', error);
    throw error;
  }
};