const express = require("express");
const cors = require("cors");
const axios = require("axios");
const NewsAPI = require("newsapi");
const newsapi = new NewsAPI("92a9bafca35d47c5b3b96217ef7803da");
const mongoose = require("mongoose");
const Visitor = require("./models/Visitor");

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

app.get("/api/news", async (req, res) => {
  const query = req.query.q || "뉴스";
  const page = parseInt(req.query.page) || 1;
  const display = parseInt(req.query.display) || 100;
  const url = `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(
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
    console.error("Error fetching news:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/news2", async (req, res) => {
  const {
    q,
    sources,
    category,
    language,
    country,
    sortBy,
    page = 1,
    pageSize,
  } = req.query;
  try {
    const response = await newsapi.v2.topHeadlines({
      q,
      sources,
      category,
      language,
      country,
      sortBy,
      page,
      pageSize,
    });
    res.json(response.articles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

app.get("/api/weather", async (req, res) => {
  const cities = [
    { regionName: "서울", engRegionName: "Seoul" },
    { regionName: "인천", engRegionName: "Incheon" },
    { regionName: "부산", engRegionName: "Busan" },
    { regionName: "수원", engRegionName: "Suwon-si" },
    { regionName: "대전", engRegionName: "Daejeon" },
    { regionName: "광주", engRegionName: "Gwangju" },
    { regionName: "대구", engRegionName: "Daegu" },
    { regionName: "울산", engRegionName: "Ulsan" },
    { regionName: "제주", engRegionName: "Jeju" },
  ];
  const apiKey = "5f855bfb00b6a6acc5c288e4bee84315";
  try {
    const weatherData = await Promise.all(
      cities.map(async (city) => {
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${city.engRegionName}&lang=kr&appid=${apiKey}&units=metric`;
        const response = await axios.get(url);
        return { ...response.data };
      })
    );
    res.json(weatherData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

// MongoDB URI 설정
const mongoUri =
  "mongodb+srv://xormsowo:wlfkf571@cluster0.mfvhg.mongodb.net/apiProject?retryWrites=true&w=majority&appName=Cluster0";

// Mongoose로 MongoDB와 연결
mongoose
  .connect(mongoUri, {}) // MongoDB URI로 연결
  .then(() => console.log("MongoDB connected")) // 연결 성공 시 메시지 출력
  .catch((err) => console.error("MongoDB connection error:", err)); // 연결 실패 시 에러 출력

// 방문자 수 증가 API (기존 코드 유지)
app.get("/api/visitor-count", async (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  try {
    let visitorData = await Visitor.findOne({ date: today });
    if (visitorData) {
      visitorData.count += 1;
    } else {
      visitorData = new Visitor({ date: today, count: 1 });
    }
    await visitorData.save();
    res.status(200).json({ message: "Visitor count updated successfully" });
  } catch (error) {
    console.error("Error updating visitor count:", error);
    res.status(500).json({ error: "Failed to update visitor count" });
  }
});

// 방문자 수 기록 조회 API
app.get("/api/visitor-stats", async (req, res) => {
  try {
    const visitorStats = await Visitor.find().sort({ date: 1 }); // 날짜순 정렬
    res.status(200).json(visitorStats);
  } catch (error) {
    console.error("Error retrieving visitor stats:", error);
    res.status(500).json({ error: "Failed to retrieve visitor stats" });
  }
});

app.listen(PORT, () => {
  console.log(`서버 실행 http://localhost:${PORT}`);
});
