const express = require("express");
const { connectToMongoDB } = require("./connection");
const urlRoute = require("./routes/url");
const URL = require("./models/url");

const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://localhost:27017/url-shortner")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.use(express.json());

app.use("/url", urlRoute);

app.get("/:shortId", async (req, res) => {
  //Creating a route to redirect the user to the original URL
  const shortId = req.params.shortId; //Getting the shortId from the request
  const entry = await URL.findOneAndUpdate(
    //Finding the URL with the shortId and updating the visitHistory
    {
      shortId, //Finding the URL with the shortId
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(), //Adding the timestamp of the visit
        },
      },
    }
  );
  res.redirect(entry.redirectUrl);
});

app.listen(PORT, () =>
  console.log(`Server is running http://localhost:${PORT}`)
);
