import express from "express";
import axios from "axios";
import cors from "cors";
import cheerio from "cheerio";
import "dotenv/config";

const app = express();

app.use(express.json());
app.use(cors());

const apiKey = process.env.apiKey;

app.post("/", async (request, response) => {
  const { name } = request.body;

  try {
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
  } catch (err) {
    const { data } = await axios.get(
      `https://www.google.com/search?tbm=isch&as_q=${name}&tbs=isz:lt,islt:8mp`
    );

    const $ = cheerio.load(data);

    const fallBackImageDueToSerpApiLimit = $("img.yWs4tf").attr();

    const { src } = fallBackImageDueToSerpApiLimit;

    return response.status(200).json({
      image: src,
      alt: name,
    });
  }
});

app.listen(process.env.PORT || 3333, () => console.log("Server is Running"));
