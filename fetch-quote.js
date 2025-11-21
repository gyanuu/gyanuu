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

  // Previous quote
  let oldQuote = "";
  if (fs.existsSync(file)) {
    oldQuote = fs.readFileSync(file, "utf8");
  }

  // If NO change → exit
  if (oldQuote === quote) {
    console.log("NO_CHANGE");
    return;
  }

  // Write new quote
  fs.writeFileSync(file, quote);

  // -------- Update README content dynamically --------
  const readme = fs.readFileSync("README.md", "utf8");

  const newBlock = `
<p align="center">
  <img src="https://quotes-github-readme.vercel.app/api?type=horizontal&theme=radical&random=${Date.now()}" />
</p>
`;

  // Replace between QUOTE_SECTION_START and QUOTE_SECTION_END
  const updatedReadme = readme.replace(
    /<!-- QUOTE_SECTION_START -->([\s\S]*?)<!-- QUOTE_SECTION_END -->/,
    `<!-- QUOTE_SECTION_START -->${newBlock}<!-- QUOTE_SECTION_END -->`
  );

  fs.writeFileSync("README.md", updatedReadme);

  console.log("QUOTE_CHANGED");
}

run();
