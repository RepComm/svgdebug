
import { Panel } from "@repcomm/exponent-ts";

export class InspectorTab extends Panel {
  constructor () {
    super();
  }
}

export class Inspector extends Panel {
  private tabs: Map<string, InspectorTab>;
  private content: SVGElement;

  constructor () {
    super();
    this.tabs = new Map();
  }
  hasTab (id: string): boolean {
    return this.tabs.has(id);
  }
  getTab (id: string): InspectorTab {
    return this.tabs.get(id);
  }
  setTab (id: string, tab: InspectorTab): this {
    this.tabs.set(id, tab);
    return this;
  }
  setContent (content: SVGElement): this {
    this.content = content;
    
    

    return this;
  }
}
