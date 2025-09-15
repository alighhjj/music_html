// debugApi.js
import axios from 'axios';

const debugApi = async () => {
  try {
    console.log('正在通过代理获取音乐列表...');
    const response = await axios.get('/api/music/wy/top?t=4');
    console.log('响应状态:', response.status);
    console.log('响应头:', response.headers);
    console.log('响应数据:', response.data);
  } catch (error) {
    console.error('获取音乐列表失败:', error);
    if (error.response) {
      console.error('错误响应状态:', error.response.status);
      console.error('错误响应头:', error.response.headers);
      console.error('错误响应数据:', error.response.data);
    }
  }
};

debugApi();