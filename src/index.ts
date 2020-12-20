
import { runOnce, Panel } from "@repcomm/exponent-ts";

import { Editor } from "./components/editor";

runOnce();

let container = new Panel()
.setId("container")
.mount(document.body);

let editor = new Editor().setId("editor").mount(container);

function loadText (url: string): Promise<string> {
  return new Promise(async (resolve, reject)=>{
    let resp, text;
    try {
      resp = await fetch(url);
      text = await resp.text();
    } catch (ex) {
      reject(ex);
      return;
    }
    resolve(text);
  });
}

function loadSVG (url: string): Promise<XMLDocument> {
  return new Promise(async (resolve, reject)=>{
    let text: string;
    let result: XMLDocument;
    let parser = new DOMParser();

    try {
      text = await loadText(url);
      result = parser.parseFromString(text, "image/svg+xml");
    } catch (ex) {
      reject(ex);
    }
    resolve(result);
  });
}

async function init () {
  let doc = await loadSVG("./res/penguin.svg");
  console.log(doc);
  editor.setDocument(doc);
}

init();
