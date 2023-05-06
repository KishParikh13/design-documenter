const express = require("express");
const axios = require('axios');

const PORT = process.env.PORT || 3001;
const app = express();

let configFigma = {
  method: 'get',
  maxBodyLength: Infinity,
  url: '',
  headers: { 
    'X-FIGMA-TOKEN': 'figd_ZThu3qadp0LnWViRLpg5ubkvy9fk9RvI-kHv7-p1'
  }
};

app.get("/figma/file", (req, res) => {
  let id = req.query.id;
  let url = `https://api.figma.com/v1/files/${id}`
  configFigma.url = url;

  axios.request(configFigma)
  .then((response) => {
    res.json(response.data);
  })
  .catch((error) => {
    res.json(error);
  });
});

app.get("/figma/fileImages", (req, res) => {
  let id = req.query.id
  let ids = req.query.ids
  let url = `https://api.figma.com/v1/images/${id}?ids=${ids}`
  configFigma.url = url;

  axios.request(configFigma)
  .then((response) => {
    res.json(response.data);
  })
  .catch((error) => {
    res.json(error);
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});