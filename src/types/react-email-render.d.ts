declare module '@react-email/render' {
  /**
   * Minimal typings to satisfy TS for @react-email/render.
   * The real package returns an HTML string from a React element.
   */
  export function render(element: any): string;
}
