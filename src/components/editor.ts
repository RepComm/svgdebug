
import { Grid } from "@repcomm/exponent-ts";
import { Exponent } from "@repcomm/exponent-ts/lib/exponent";
import { Inspector } from "./inspector";
import { TreeView } from "./treeview";
import { Menu } from "./menu";

import { ContentInterop } from "./contentinterop";

export class Editor extends Grid implements ContentInterop {
  private content: SVGElement;
  private menu: Menu;
  private inspector: Inspector;
  private treeview: TreeView;
  private renderer: Exponent;

  private document: XMLDocument;

  constructor() {
    super();
    this.setStyleItem("grid-template-rows", "minmax(0, 1fr) minmax(0, 15fr)");
    // this.setRowCount(2);
    this.setStyleItem("grid-template-columns", "minmax(0, 1fr) minmax(0, 2fr) minmax(0, 1fr)");
    // this.setColumnCount(3);

    this.menu = new Menu().setId("menu");
    this.setCell(this.menu, 1, 1, 4, 1);

    this.inspector = new Inspector(this).setId("inspector");
    this.setCell(this.inspector, 1, 2);

    this.renderer = new Exponent()
      .make("iframe")
      .addClasses("exponent-panel")
      .setStyleItem("width", "100%")
      .setStyleItem("height", "100%")
      .setId("renderer");
    this.setCell(this.renderer, 2, 2);

    this.treeview = new TreeView(this).setId("treeview");
    this.setCell(this.treeview, 3, 2);
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
    this.inspector.setContent(this.content);
    return this;
  }
  notifyContentModified(modifier: any, content: SVGElement): this {
    this.onContentModified(modifier, content);
    return this;
  }
  onContentModified(modifier: any, content: SVGElement): this {
    this.treeview.notifyContentModified(modifier, content);

    let serializer = new XMLSerializer();
    //TODO - implement canvas renderer redraw here
    (this.renderer.element as HTMLIFrameElement).srcdoc = serializer.serializeToString(this.document);

    return this;
  }

  /**Sets the document
   * @param document 
   */
  setDocument(document: XMLDocument): this {
    this.document = document;
    this.treeview.setDocument(this.document);

    let serializer = new XMLSerializer();
    //TODO - implement canvas renderer redraw here
    (this.renderer.element as HTMLIFrameElement).srcdoc = serializer.serializeToString(this.document);

    return this;
  }
}
