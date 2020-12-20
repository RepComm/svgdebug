
import { Exponent, Panel } from "@repcomm/exponent-ts";
import { ContentInterop } from "../contentinterop";
import { Inspector } from "../inspector";
import { EditorField } from "./field";
import { EditorItem } from "./item";

/**A group of configurations
 */
export class InspectorEditor extends Panel implements ContentInterop {
  private inspector: Inspector;

  protected content: SVGElement;

  private items: Set<EditorItem>;

  private minimized: boolean = false;

  private title: Panel;
  private folder: Panel;

  constructor (inspector: Inspector) {
    super();
    this.addClasses("inspector-editor");
    this.inspector = inspector;
    if (!inspector) throw `Inspector argument cannot be undefined or null, was ${inspector}`;
    this.items = new Set();

    this.title = new Exponent()
    .make("span")
    .addClasses("inspector-editor-title")
    .setTextContent("title")
    .mount(this);

    this.folder = new Panel()
    .addClasses("inspector-editor-folder")
    .mount(this);

    this.title.on("click", ()=>{
      this.toggleMinimized();
    });
  }
  setTitle (txt: string): this {
    this.title.setTextContent(txt);
    return this;
  }
  protected build () {
    this.folder.removeChildren();
    for (let field of this.items) {
      field.mount(this.folder);
    }
  }
  addItem (item: EditorItem, build: boolean = false): this {
    this.items.add(item);
    if (build) this.build();
    return this;
  }
  removeItem (item: EditorItem, build: boolean = false): this {
    this.items.delete(item);
    if (build) this.build();
    return this;
  }
  hasItem (field: EditorField): boolean {
    return this.items.has(field);
  }
  setContent (target: SVGElement): this {
    this.content = target;
    this.onSwitchContent();
    return this;
  }
  onSwitchContent () {
    for (let field of this.items) {
      field.setContent(this.content);
    }
  }
  notifyContentModified?(modifier: any, content: SVGElement): this {
    this.onContentModified(modifier, content);
    return this;
  }
  onContentModified(modifier: any, content: SVGElement): this {
    this.inspector.notifyContentModified(modifier, content);
    return this;
  }
  toggleMinimized (): this {
    this.setMinimized(!this.getMinimized());
    return this;
  }
  getMinimized (): boolean {
    return this.minimized;
  }
  setMinimized (min: boolean = true): this {
    this.minimized = min;
    if (this.minimized) {
      this.folder.addClasses("inspector-editor-folder-minimized");
    } else {
      this.folder.removeClasses("inspector-editor-folder-minimized");
    }
    return this;
  }
}
