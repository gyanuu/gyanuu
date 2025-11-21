import fs from "fs";
import fetch from "node-fetch";

async function run() {
  const url = "https://quotes-github-readme.vercel.app/api?type=horizontal&theme=radical";
  const res = await fetch(url);
  const svg = await res.text();

  // Extract quote text from SVG
  const match = svg.match(/<text[^>]*>(.*?)<\/text>/);
  const quote = match ? match[1] : "NO_QUOTE_FOUND";

  const file = "last_quote.txt";

  // Read previous quote
  let oldQuote = "";
  if (fs.existsSync(file)) {
    oldQuote = fs.readFileSync(file, "utf8");
  }

  // Compare
  if (oldQuote !== quote) {
    console.log("QUOTE_CHANGED");
    fs.writeFileSync(file, quote);
  } else {
    console.log("NO_CHANGE");
  }
}

run();
