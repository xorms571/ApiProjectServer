// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.get("/api/search", async (req, res) => {
  const query = req.query.query || "쇼핑";
  const page = parseInt(req.query.page) || 1;
  const display = parseInt(req.query.display) || 50;

  const url = `https://openapi.naver.com/v1/search/shop.json?query=${encodeURIComponent(
    query
  )}&display=${display}&start=${(page - 1) * display + 1}&sort=sim`;

  try {
    const response = await axios.get(url, {
      headers: {
        "X-Naver-Client-Id": 'SiFXdkNpyPZc309ZLHYX',
        "X-Naver-Client-Secret": 'bjij2iYoVh',
      },
    });

    // 가격 제한 없이 데이터를 그대로 클라이언트에 보냄
    res.json({ items: response.data.items });
  } catch (error) {
    console.error("Error fetching data from Naver API:", error);
    res.status(500).send("Internal Server Error");
  }
});


app.listen(PORT, () => {
    console.log(`서버 실행 http://localhost:${PORT}`);
});
