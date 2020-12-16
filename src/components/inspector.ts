
import { Component, Panel } from "@repcomm/exponent-ts";

export type InspectFieldType = "number" | "string";

export class InspectorField extends Panel {
  private label: Component;
  private input: Component;

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
}

export class Inspector extends Panel {
  private content: SVGElement;

  private idField: InspectorField;

  constructor () {
    super();
    this.idField = new InspectorField()
    .setLabel("id")
    .mount(this);
  }
  setContent (content: SVGElement): this {
    this.content = content;
    
    this.idField.setValue(this.content.id);

    return this;
  }
}
