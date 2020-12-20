
import { Component, Button } from "@repcomm/exponent-ts";
import { InspectorEditor } from "./editor";
import { EditorItem } from "./item";

export type InspectFieldType = "number" | "string" | "button";

export class EditorField extends EditorItem {
  private label: Component;
  private input: Component;
  private enableButton: Button;

  constructor (editor: InspectorEditor) {
    super(editor);
    
    this.addClasses("inspector-field");
    this.label = new Component()
    .make("span")
    .addClasses("inspector-field-label")
    .mount(this);

    this.input = new Component()
    .make("input")
    .addClasses("inspector-field-input")
    .mount(this);

    this.enableButton = new Button()
    .setTextContent("-")
    .addClasses("inspector-field-enable")
    .mount(this)
    .on("click", ()=>{
      this.setEnabled(!this.enabled);
    });
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
    this.label.setTextContent(name);
    return this;
  }
  setType(type: InspectFieldType): this {
    if (type == "number") {
      this.input.setAttr("type", "number");
    } else if (type == "string") {
      this.input.setAttr("type", "string");
    }
    return this;
  }
  setValue (v: any): this {
    this.input.setAttr("value", v);
    return this;
  }
  getValue (): any {
    return this.input.getAttr("value");
  }
  onEnable() {
    if (this.getEnabled()) {
      this.enableButton?.setTextContent("-");
      this.input?.element.removeAttribute("disabled");
    } else {
      this.enableButton?.setTextContent("+");
      this.input?.setAttr("disabled", "true");
    }
  }
}
