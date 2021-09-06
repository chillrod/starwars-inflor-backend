import express from "express";
import axios from "axios";
import cors from "cors";
import cheerio from "cheerio";

const app = express();

app.use(express.json());
app.use(cors());

app.post("/", async (request, response) => {
  const { name } = request.body;

  try {
    const { data } = await axios.get(
      `https://www.google.com/search?tbm=isch&as_q=${name}&tbs=isz:lt,islt:24mp`
    );

    setTimeout(() => {
      const $ = cheerio.load(data);

      const fallBackImageDueToSerpApiLimit = $("img.yWs4tf").attr();

      const { src } = fallBackImageDueToSerpApiLimit;

      return response.status(200).json({
        image: src,
        alt: name,
      });
    }, 100);
  } catch (err) {
    return res.status(400).json({ message: err });
  }
});

app.listen(process.env.PORT || 3333, () => console.log("Server is Running"));
