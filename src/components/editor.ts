
import { Grid } from "@repcomm/exponent-ts";
import { Exponent } from "@repcomm/exponent-ts/lib/exponent";
import { Inspector } from "./inspector";
import { TreeView } from "./treeview";
import { Menu } from "./menu";

export class Editor extends Grid {
  private menu: Menu;
  private inspector: Inspector;
  private treeview: TreeView;
  private renderer: Exponent;

  private content: XMLDocument;

  constructor () {
    super();
    this.setStyleItem("grid-template-rows", "minmax(0, 1fr) minmax(0, 15fr)");
    // this.setRowCount(2);
    this.setStyleItem("grid-template-columns", "minmax(0, 1fr) minmax(0, 2fr) minmax(0, 1fr)");
    // this.setColumnCount(3);

    this.menu = new Menu().setId("menu");
    this.setCell(this.menu, 1, 1, 4, 1);

    this.inspector = new Inspector().setId("inspector");
    this.setCell(this.inspector, 1, 2);

    this.renderer = new Exponent()
    .make("iframe")
    .addClasses("exponent-panel")
    .setStyleItem("width", "100%")
    .setStyleItem("height", "100%")
    .setId("renderer");
    this.setCell(this.renderer, 2, 2);

    this.treeview = new TreeView().setId("treeview");
    this.setCell(this.treeview, 3, 2);

    this.treeview.onSelectionChange((current, old)=>{
      this.inspector.setContent(current);
    });
  }

  private onContentChange () {
    //this will also tree selection change to root, hence trigger inspector refresh
    this.treeview.setContent(this.content);
  }

  setContent (content: XMLDocument): this {
    this.content = content;
    this.onContentChange();
    return this;
  }
}
