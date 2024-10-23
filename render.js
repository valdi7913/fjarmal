import { Eta } from "eta";
import fs from 'fs';

const viewPath = "./src/views";
const buildPath = "./dist";

if (!fs.existsSync(buildPath)) {
  fs.mkdirSync(buildPath);
  console.log(`Directory '${buildPath}' created.`);
} else {
  console.log(`Directory '${buildPath}' already exists.`);
}

const eta = new Eta({ views: viewPath})

const pages = [
    "heim",
    "lan",
    "laun",
    "sparnadur"
];

const startTime = Date.now();

pages.forEach((page) => {
    try {
        const res = eta.render(page);
        fs.writeFileSync(`${buildPath}/${page}.html`, res);
    } catch(e) {
        throw new Error(`Error occured while rendering page ${page}.eta ${e}`);
    }
});

console.log(`Rendered ${pages.length} pages in ${(Date.now() - startTime)} milliseconds`);
