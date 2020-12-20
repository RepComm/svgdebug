
import { Button } from "@repcomm/exponent-ts";
import { InspectorEditor } from "./editor";
import { EditorItem } from "./item";

export interface ActionCallback {
  (): void;
}

export class EditorAction extends EditorItem {
  private btn: Button;

  constructor (editor: InspectorEditor) {
    super(editor);
    
    this.addClasses("inspector-field");
    
    this.btn = new Button()
    .setTextContent("button")
    .addClasses("inspector-editor-button")
    .mount(this);
  }
  listen (cb: ActionCallback): this {
    this.on("click", cb);
    return this;
  }
  notifyContentModified(modifier: any, content: SVGElement): this {
    throw new Error("Method not implemented.");
  }
  onContentModified(modifier: any, content: SVGElement): this {
    throw new Error("Method not implemented.");
  }
  onContentSwitch(): this {
    throw new Error("Method not implemented.");
  }
  setLabel (name: string): this {
    this.btn.setTextContent(name);
    return this;
  }
}

