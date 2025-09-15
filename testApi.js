// testApi.js
import { fetchMusicList } from './src/services/musicApi';

const testApi = async () => {
  try {
    console.log('正在获取音乐列表...');
    const data = await fetchMusicList('4');
    console.log('获取到的音乐列表:', data);
  } catch (error) {
    console.error('获取音乐列表失败:', error);
  }
};

testApi();