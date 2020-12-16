
import { Panel, Component, Button } from "@repcomm/exponent-ts";

export type InspectFieldType = "number" | "string";

export class InspectorField extends Panel {
  private label: Component;
  private input: Component;
  private enableButton: Button;

  constructor () {
    super();
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
