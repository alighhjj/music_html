接口地址： https://api.52vmy.cn/api/music/wy/top

返回格式： JSON

请求方式： GET

请求示例： https://api.52vmy.cn/api/music/wy/top?t=1

接口定制： 点此加入用户群

默认QPS： 每2秒最多4次 携带Token可无视限制

请求参数说明：

名称	必填	类型	说明
t	否	string	榜单，1:原创榜/2:新歌榜/3:飙升榜/4:热歌榜
n	否	string	返回数据

返回数据示例：
{
    "code": 200,
    "msg": "成功",
    "data": [
        {
            "song": "3977",
            "sing": "ljz329",
            "pic": "http://p2.music.126.net/eMJnZQtM6CrzdOLNDUjAYQ==/109951171976195344.jpg",
            "id": 2743505559,
            "url": "https://music.163.com/song/media/outer/url?id=2743505559"
        },
        {
            "song": "不遥远",
            "sing": "橘子海 (Orange Ocean)/鹭卓",
            "pic": "http://p2.music.126.net/04nniCZsnBIYkAryK22YvQ==/109951171989910407.jpg",
            "id": 2744319884,
            "url": "https://music.163.com/song/media/outer/url?id=2744319884"
        }
    ]
}

歌曲音频文件url： "http://music.163.com/song/media/outer/url?id=" + id + "mp3"
示例：http://music.163.com/song/media/outer/url?id=2744319884.mp3


