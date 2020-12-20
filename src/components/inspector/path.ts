

import { Transform2d } from "@repcomm/scenario2d";
import { Inspector } from "../inspector";
import { InspectorEditor } from "./editor";
import { EditorField } from "./field";

export class PathEditor extends InspectorEditor {
  private fieldD: EditorField;

  constructor (inspector: Inspector) {
    super(inspector);
    this.setTitle("d");

    this.fieldD = new EditorField(this).setLabel("d").setValue("empty");
    this.addItem(this.fieldD);

    this.build();
  }
  onSwitchContent (): this {
    if (this.content instanceof SVGPathElement) {
      this.fieldD.setValue(this.content.getAttribute("d"));
    }
    return this;
  }
  onEnable() {
    super.onEnable();

    if (this.getEnabled()) {
      
    } else {

    }
  }
}

