

import { Panel } from "@repcomm/exponent-ts";
import { ContentInterop } from "../contentinterop";
import { InspectorEditor } from "./editor";

export class EditorItem extends Panel implements ContentInterop {
  protected content: SVGElement;

  private editor: InspectorEditor;

  constructor (editor: InspectorEditor) {
    super();
    this.editor = editor;
    if (!this.editor) throw `Editor argument cannot be null or undefined, was ${editor}`;

    this.addClasses("inspector-editor-item");
  }
  notifyContentModified(modifier: any, content: SVGElement): this {
    throw new Error("Method not implemented.");
  }
  onContentModified(modifier: any, content: SVGElement): this {
    throw new Error("Method not implemented.");
  }
  setContent(content: SVGElement): this {
    this.content = content;
    this.onContentSwitch();
    return this;
  }
  getContent(): SVGElement {
    return this.content;
  }
  onContentSwitch(): this {
    throw new Error("Method not implemented.");
  }
}

