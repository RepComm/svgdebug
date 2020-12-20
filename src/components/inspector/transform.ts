
import { Transform2d } from "@repcomm/scenario2d";
import { Inspector } from "../inspector";
import { EditorAction } from "./action";
import { InspectorEditor } from "./editor";
import { EditorField } from "./field";

import { PathHelper } from "../../svgutils";

export class TransformEditor extends InspectorEditor {
  private transform: Transform2d;

  private fieldX: EditorField;
  private fieldY: EditorField;
  private fieldR: EditorField;
  private fieldS: EditorField;
  private btnBake: EditorAction;

  constructor (inspector: Inspector) {
    super(inspector);
    this.setTitle("transform");
    this.transform = new Transform2d();

    this.fieldX = new EditorField(this).setLabel("x").setValue(0);
    this.addItem(this.fieldX);

    this.fieldY = new EditorField(this).setLabel("y").setValue(0);
    this.addItem(this.fieldY);

    this.fieldR = new EditorField(this).setLabel("rotation").setValue(0);
    this.addItem(this.fieldR);

    this.fieldS = new EditorField(this).setLabel("scale").setValue(1);
    this.addItem(this.fieldS);

    this.btnBake = new EditorAction(this).setLabel("Bake Transforms").listen(()=>{
      this.transform.position.setX(
        parseFloat(this.fieldX.getValue())
      );
      this.transform.position.setY(
        parseFloat(this.fieldY.getValue())
      );
      this.transform.rotation = parseFloat(this.fieldR.getValue());
      this.transform.scale = parseFloat(this.fieldS.getValue());

      let dOld = this.content.getAttribute("d");

      let path = PathHelper.from(this.content.getAttribute("d"));
      path.applyTransform(this.transform);

      let dNew = path.to().toLowerCase();

      console.log("Old:", dOld);
      console.log("New:", dNew);

      this.content.setAttribute("d", dNew);

      this.transform.position.set(0, 0);
      this.transform.rotation = 0;
      this.transform.scale = 1;
      this.notifyContentModified(this, this.content);
    });
    this.addItem(this.btnBake);

    this.build();
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
