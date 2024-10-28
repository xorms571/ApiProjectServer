const express = require("express");
const cors = require("cors");
const axios = require("axios");
const NewsAPI = require("newsapi");
const newsapi = new NewsAPI('92a9bafca35d47c5b3b96217ef7803da');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

const CLIENT_ID = "SiFXdkNpyPZc309ZLHYX"; // 네이버 클라이언트 ID 입력
const CLIENT_SECRET = "bjij2iYoVh"; // 네이버 클라이언트 Secret 입력

app.get("/api/search", async (req, res) => {
  const query = req.query.query || "쇼핑";
  const page = parseInt(req.query.page) || 1;
  const display = parseInt(req.query.display) || 100;
  const url = `https://openapi.naver.com/v1/search/shop.json?query=${encodeURIComponent(
    query
  )}&display=${display}&start=${(page - 1) * display + 1}&sort=sim`;
  try {
    const response = await axios.get(url, {
      headers: {
        "X-Naver-Client-Id": CLIENT_ID,
        "X-Naver-Client-Secret": CLIENT_SECRET,
      },
    });
    res.json({ items: response.data.items });
  } catch (error) {
    console.error("Error fetching data from Naver API:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get('/api/news', async (req, res) => {
  const query = req.query.q || '뉴스'; 
  const page = parseInt(req.query.page) || 1;
  const display = parseInt(req.query.display) || 100;
  const url = `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(
    query
  )}&display=${display}&start=${(page - 1) * display + 1}&sort=sim`;

  try {
      const response = await axios.get(url, {
          headers: {
              'X-Naver-Client-Id': CLIENT_ID,
              'X-Naver-Client-Secret': CLIENT_SECRET,
          }
      });
      res.json({ items: response.data.items });
  } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/api/news2', async (req, res) => {
  const { q, sources, category, language, country, sortBy } = req.query;
  try {
    const response = await newsapi.v2.topHeadlines({
      q,
      sources,
      category,
      language,
      country,
      sortBy
    });
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});


app.listen(PORT, () => {
  console.log(`서버 실행 http://localhost:${PORT}`);
});
