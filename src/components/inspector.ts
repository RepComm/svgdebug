
import { Panel } from "@repcomm/exponent-ts";
import { PathHelper } from "../svgutils";
import { InspectorField } from "./inspector/field";

export type SVGNodeTypeStrings = "svg"|"defs"|"metadata"|"g"|"path";

export interface InspectorFieldChangeCallback {
  (element: SVGElement, attrname: string): void;
}

export class Inspector extends Panel {
  private content: SVGElement;

  private fields: Array<InspectorField>;
  private fieldChangeCallbacks: Set<InspectorFieldChangeCallback>;

  constructor () {
    super();
    this.fieldChangeCallbacks = new Set();
  }
  onContentChange (cb: InspectorFieldChangeCallback): this {
    this.fieldChangeCallbacks.add(cb);
    return this;
  }
  setContent (content: SVGElement): this {
    this.content = content;

    this.removeChildren();

    if (content.id) {
      let to: number = -1;
      let idField = new InspectorField()
      .setLabel("id")
      .setValue(content.id)
      .mount(this).on("keyup", ()=>{
        if (to) clearTimeout(to);
        to = setTimeout(()=>{
          console.log("Changing id");
          content.setAttribute("id", idField.getValue());
          for (let cb of this.fieldChangeCallbacks) {
            cb(content, "id");
          }
          to = -1;
        }, 350);
      });
    }

    if (content.hasAttribute("transform")) {
      let transformField = new InspectorField()
      .setLabel("transform")
      .setValue(content.getAttribute("transform"))
      .mount(this);
    }

    if (content.hasAttribute("width")) {
      let widthField = new InspectorField()
      .setLabel("width")
      .setValue(content.getAttribute("width"))
      .mount(this);
    }
    if (content.hasAttribute("height")) {
      let heightField = new InspectorField()
      .setLabel("height")
      .setValue(content.getAttribute("height"))
      .mount(this);
    }
    if (content.hasAttribute("shape-rendering")) {
      let shapeRenderingField = new InspectorField()
      .setLabel("shape-rendering")
      .setValue(content.getAttribute("shape-rendering"))
      .mount(this);
    }

    let type: SVGNodeTypeStrings = (content.nodeName as SVGNodeTypeStrings);
    if (type == "path") {
      let dField = new InspectorField()
      .setLabel("d")
      .setValue(content.getAttribute("d"))
      .mount(this);

      let helper = PathHelper.from(content.getAttribute("d"));
      let avg = helper.averagePoint();
      
      console.log("average path point", avg);
      // content.setAttribute("transform", `translate(${-avg[0]} ${-avg[1]})`);
      // for (let cb of this.fieldChangeCallbacks) {
      //   cb(content, "style");
      // }

      let to = -1;
      let styleField = new InspectorField()
      .setLabel("style")
      .setValue(content.getAttribute("style"))
      .mount(this)
      .on("keyup", ()=>{
        if (to) clearTimeout(to);
        to = setTimeout(()=>{
          console.log("Changing document");
          content.setAttribute("style", styleField.getValue());
          for (let cb of this.fieldChangeCallbacks) {
            cb(content, "style");
          }
          to = -1;
        }, 350);
      });
    }

    return this;
  }
}
