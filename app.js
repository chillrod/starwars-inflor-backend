import express from "express";
import axios from "axios";
import cors from "cors";
import "dotenv/config";

const app = express();

app.use(express.json());
app.use(cors());

const apiKey = process.env.apiKey;

app.post("/", async (request, response) => {
  const { name } = request.body;

  await axios
    .get(
      `https://serpapi.com/search.json?&tbm=isch&engine=google&q=${name}&api_key=${apiKey}`
    )
    .then((res) => {
      const { data } = res;

      const { images_results } = data;

      return response.status(200).json({
        image: images_results[0].original,
        alt: images_results[0].title,
      });
    });
});

app.listen(3333, () => console.log("Server is Running"));
