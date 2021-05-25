// const express = require("express");
// const axios = require("axios");
// const melonn = express();

// const KEY = "oNhW2TBOlI1t4kWb3PEad1K1S1KxKuuI3GX6rGvT";

// axios.create({
//   baseURL: "https://yhua9e1l30.execute-api.us-east-1.amazonaws.com/sandbox",
//   headers: {
//     "x-api-key": "oNhW2TBOlI1t4kWb3PEad1K1S1KxKuuI3GX6rGvT"
//   }
// });

// module.exports = melonn;

const express = require("express");
const axios = require("axios");
const melonn = express();
axios.create({
  baseURL: "https://yhua9e1l30.execute-api.us-east-1.amazonaws.com/sandbox",
  headers: {
    "x-api-key": "oNhW2TBOlI1t4kWb3PEad1K1S1KxKuuI3GX6rGvT"
  }
});

// melonn.get("https://google.com", (req, res) => {
//   axios.get(baseURL).then(response => {
//     res.send(response.data);
//   });
// });

module.exports = melonn;
