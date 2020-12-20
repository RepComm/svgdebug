
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
  private btnTransformToCenter: EditorAction;

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
      this.displayToInternal();
      
      let dOld = this.content.getAttribute("d");

      let path = PathHelper.from(this.content.getAttribute("d"));
      path.applyTransform(this.transform);

      let dNew = path.to();

      console.log("Old:", dOld);
      console.log("New:", dNew);

      this.content.setAttribute("d", dNew);
      this.internalToDisplay();
      
      this.notifyContentModified(this, this.content);
    });
    this.addItem(this.btnBake);

    this.btnTransformToCenter = new EditorAction(this).setLabel("Transform To Center").listen(()=>{
      let path = PathHelper.from(this.content.getAttribute("d"));
      this.transform.position.copy(path.averagePoint()).mulScalar(-1);
      
      path.applyTransform(this.transform);

      this.transform.position.mulScalar(-1);
      
      this.content.setAttribute("d", path.to());

      this.content.setAttribute("transform", this.transformToString());

      this.internalToDisplay();
      this.notifyContentModified(this, this.content);
    });
    this.addItem(this.btnTransformToCenter);

    this.build();
  }
  private internalToDisplay () {
    this.fieldX.setValue(this.transform.position.x);
    this.fieldY.setValue(this.transform.position.y);
    this.fieldR.setValue(this.transform.rotation);
    this.fieldS.setValue(this.transform.scale);
  }
  private displayToInternal () {
    this.transform.position.x = parseFloat(this.fieldX.getValue());
    this.transform.position.y = parseFloat(this.fieldY.getValue());
    this.transform.rotation = parseFloat(this.fieldR.getValue());
    this.transform.scale = parseFloat(this.fieldS.getValue());
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
