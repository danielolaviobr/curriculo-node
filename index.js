import express from "express";
import chromium from "@sparticuz/chrome-aws-lambda";
import playwright from "playwright";

const app = express();
app.use(express.json());

app.post("/generate", async function (req, res) {
  const url = req.body.url;

  console.log(url);

  const browser = await playwright.chromium.launch({
    args: ["--window-size=1080,720"],
    // executablePath: await chromium.executablePath,
    headless: true,
  });

  console.log("Connected");

  const context = await browser.newContext();
  const page = await context.newPage();

  // await page.goto(`${getBaseUrl()}/pdf/${id}`, {
  //   waitUntil: "networkidle",
  // });
  // await page.addStyleTag({ content: ".print-blank { display: none}" });
  // const pdfBuffer = await page.pdf({ format: "A4" });

  await page.goto(url);
  // await page.goto(`${getBaseUrl()}/pdf/preview/${resumeId}`);
  const image = await page.screenshot({ type: "jpeg" });
  await browser.close();

  res.writeHead(200, {
    "Content-Type": "image/jpeg",
    "Content-Length": image.length,
  });
  res.end(image);
});

app.listen(5001, () => console.log("Running server"));
