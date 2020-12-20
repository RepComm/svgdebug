import { Component, Panel } from "@repcomm/exponent-ts";
import { ContentInterop } from "./contentinterop";
import { Editor } from "./editor";

export class TreeViewNode extends Panel {
  private nodeId: string;
  private idLabel: Component;
  private typeLabel: Component;

  private node: SVGElement;

  constructor () {
    super ();
    this.addClasses("treeview-node");
    this.setStyleItem("flex-direction", "column");
    this.nodeId = "node";

    this.typeLabel = new Component()
    .make("span")
    .addClasses("treeview-node-type")
    .mount(this);

    this.idLabel = new Component()
    .make("span")
    .addClasses("treeview-node-id")
    .mount(this);

    this.setNodeId("node");
  }
  setElement (element: SVGElement): this {
    this.node = element;
    if (!element) return this;
    this.setNodeId(element.id);
    this.typeLabel.setTextContent(`<${element.nodeName}>`);
    return this;
  }
  setNodeId (name: string): this {
    this.nodeId = name;
    if (name) {
      this.idLabel.setTextContent(`id: ${name}`);
      this.idLabel.mount(this);
    } else {
      this.idLabel.unmount();
    }
    return this;
  }
  getNodeId (): string {
    return this.nodeId;
  }
  getNode (): SVGElement {
    return this.node;
  }
}

export class TreeView extends Panel implements ContentInterop {
  private editor: Editor;
  private document: XMLDocument;
  private previousSelected: TreeViewNode;
  private selected: TreeViewNode;
  private viewNodes: Set<TreeViewNode>;

  constructor (editor: Editor) {
    super();
    this.editor = editor;
    this.setStyleItem("flex-direction", "column");
    this.setStyleItem("overflow", "scroll");
    this.viewNodes = new Set();
  }
  select (node: TreeViewNode): this {
    this.previousSelected = this.selected;
    this.selected = node;

    if (this.previousSelected) {
      this.previousSelected.removeClasses("treeview-node-selected");
    }
    if (this.selected) {
      this.selected.addClasses("treeview-node-selected");
    }

    this.editor.setContent(this.selected.getNode());
    return this;
  }
  setDocument (document: XMLDocument): this {
    this.document = document;
    this.removeChildren();
    this.build(this.document.firstChild as SVGElement);

    for (let first of this.viewNodes) {
      this.select(first);
      break;
    }

    return this;
  }
  private build (node: SVGElement, levels: number = 0) {
    let display = new TreeViewNode().setElement(node).mount(this);
    display.setStyleItem("padding-left", `${levels}em`);
    display.on("click", ()=>{
      this.select(display);
    });

    if (node.hasChildNodes()) {
      for (let child of node.children) {
        this.build( child as SVGElement, levels+1 );
      }
    }
  }
  getRootSVG (): SVGElement {
    return (this.document.getRootNode() as SVGElement);
  }
  getViewNodeByElement (element: SVGElement): TreeViewNode {
    for (let viewNode of this.viewNodes) {
      if (viewNode.getNode() === element) return viewNode;
    }
    return undefined;
  }
  notifyContentModified (modifier: any, content: SVGElement): this {
    this.onContentModified(modifier, content);
    return this;
  }
  onContentModified (modifier: any, element: SVGElement): this {
    if (this.selected.getNode() == element) {
      this.selected.setElement(element);
    } else {
      let viewNode = this.getViewNodeByElement(element);
      if (viewNode) {
        viewNode.setElement(element);
      }
    }
    return this;
  }
}
