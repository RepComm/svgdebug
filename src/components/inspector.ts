
import { Panel } from "@repcomm/exponent-ts";
import { ContentInterop } from "./contentinterop";
import { Editor } from "./editor";
import { InspectorEditor } from "./inspector/editor";
import { PathEditor } from "./inspector/path";
import { TransformEditor } from "./inspector/transform";

export interface InspectorChangeListener {
  (element: SVGElement): void;
}

export class Inspector extends Panel implements ContentInterop {
  private editor: Editor;

  private content: SVGElement;

  private editors: Set<InspectorEditor>;

  constructor (editor: Editor) {
    super();
    this.editor = editor;
    this.editors = new Set();
    this.addEditor(new TransformEditor(this));

    this.addEditor(new PathEditor(this));
  }
  getContent(): SVGElement {
    return this.content;
  }
  setContent (content: SVGElement): this {
    this.content = content;
    this.onContentSwitch();
    return this;
  }
  onContentSwitch(): this {
    for (let editor of this.editors) {
      editor.setContent(this.content);
    }
    return this;
  }
  notifyContentModified?(modifier: any, content: SVGElement): this {
    this.onContentModified(modifier, content);
    return this;
  }
  onContentModified(modifier: any, content: SVGElement): this {
    this.editor.notifyContentModified(modifier, content);
    return this;
  }
  hasEditor (editor: InspectorEditor): boolean {
    return this.editors.has(editor);
  }
  addEditor (editor: InspectorEditor): this {
    this.editors.add(editor);
    editor.mount(this);
    editor.setContent(this.content);
    return this;
  }
}
