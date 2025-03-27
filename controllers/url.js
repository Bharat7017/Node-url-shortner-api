const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
  const body = req.body; //Getting the body of the request
  if (!body.url) {
    return res.status(400).json({ error: "Please provide a URL" });
  } //Checking if the URL is provided or not

  const shortID = shortid();
  await URL.create({
    //Creating a new URL
    shortId: shortID,
    redirectUrl: body.url,
    visitHistory: [],
  });
  return res.json({ id: shortID });
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
};
