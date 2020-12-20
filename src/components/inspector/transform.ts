
import { Transform2d } from "@repcomm/scenario2d";
import { Inspector } from "../inspector";
import { InspectorEditor } from "./editor";
import { InspectorField } from "./field";

export class TransformEditor extends InspectorEditor {
  private transform: Transform2d;

  constructor (inspector: Inspector) {
    super(inspector);
    this.setTitle("transform");
    this.transform = new Transform2d();

    let fieldX = new InspectorField(this).setLabel("x").setValue(0);
    this.addField(fieldX);

    let fieldY = new InspectorField(this).setLabel("y").setValue(0);
    this.addField(fieldY);

    let fieldR = new InspectorField(this).setLabel("rotation").setValue(0);
    this.addField(fieldR);

    let fieldS = new InspectorField(this).setLabel("scale").setValue(0);
    this.addField(fieldS);

    this.build();
  }
  setContent(content: SVGElement): this {
    this.onSwitchContent();
    return this;
  }
  onSwitchContent (): this {
    return this;
  }
  private transformToString () {
    return `translate (${this.transform.position.x},${this.transform.position.y}) rotate(${this.transform.rotation}) scale(${this.transform.scale})`;
  }
  onEnable() {
    super.onEnable();

    if (this.getEnabled()) {
      

    } else {

    }
  }
}
