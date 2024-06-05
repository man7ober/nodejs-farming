const fs = require("fs");
const http = require("http");
const url = require("url");

const replaceTemplate = require("./replaceTemplate");

const data = fs.readFileSync(`${__dirname}/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);

const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);

// CREATE SERVER
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // OVERVIEW PAGE
  if (pathname === "/" || pathname === "/overview") {
    const cardHtml = dataObj.map((el) => replaceTemplate(tempCard, el));
    const result = tempOverview.replace("PRODUCT_CARD", cardHtml);

    res.writeHead(200, { "Content-type": "text/html" });
    res.end(result);

    // PRODUCT PAGE
  } else if (pathname === "/product") {
    const product = dataObj[query.id];
    const result = replaceTemplate(tempProduct, product);

    res.writeHead(200, { "Content-type": "text/html" });
    res.end(result);

    // API PAGE
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);

    // NOT FOUND PAGE
  } else {
    res.writeHead(404, { "Content-type": "text/html" });
    res.end("<h3>Page NOT FOUND!</h3>");
  }
});

// START SERVER
server.listen(8000, "127.0.0.1", () => {
  console.log("Listening on 8000");
});
