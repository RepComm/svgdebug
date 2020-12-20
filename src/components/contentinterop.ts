
export interface ContentInterop {
  /**Sets the content - will trigger onContentSwitch
   * @param content 
   */
  setContent? (content: SVGElement): this;
  /**Allows retrival of the content*/
  getContent? (): SVGElement;
  /**Gets fired when the content context was switched*/
  onContentSwitch? (): this;
  /**Provides a notification that the content was changed - fires onContentModified
   * Purpose: so other sources can notify you of a change
   */
  notifyContentModified? (modifier: any, content: SVGElement): this;
  /**Gets fired when the content was changed.
   * 
   * modifier is the object that directly modified the content
   */
  onContentModified? (modifier: any, content: SVGElement): this;
}
