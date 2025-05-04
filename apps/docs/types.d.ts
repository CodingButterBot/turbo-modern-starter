declare module '*.mdx' {
  const MDXComponent: (props: any) => JSX.Element;
  export default MDXComponent;
}

// Add type augmentation for testing-library/jest-dom
import '@testing-library/jest-dom';

declare module 'vitest' {
  interface Assertion<T = any> {
    toBeInTheDocument(): T;
    toBeVisible(): T;
    toBeInvalid(): T;
    toBeValid(): T;
    toBeRequired(): T;
    toBeDisabled(): T;
    toBeEnabled(): T;
    toBeEmpty(): T;
    toBeEmptyDOMElement(): T;
    toBePartiallyChecked(): T;
    toBeChecked(): T;
    toBeInTheDoc(): T;
    toHaveAccessibleDescription(expected?: string | RegExp): T;
    toHaveAccessibleName(expected?: string | RegExp): T;
    toHaveAttribute(name: string, expected?: string | RegExp): T;
    toHaveClass(...classNames: string[]): T;
    toHaveFocus(): T;
    toHaveFormValues(expectedValues: Record<string, any>): T;
    toHaveStyle(expected: Record<string, any>): T;
    toHaveTextContent(expected: string | RegExp, options?: { normalizeWhitespace: boolean }): T;
    toHaveValue(expected: string | string[] | number): T;
    toHaveDisplayValue(expected: string | string[] | RegExp): T;
    toBeChecked(): T;
    toHaveFocus(): T;
    toContainElement(element: HTMLElement | null): T;
    toContainHTML(htmlText: string): T;
  }
}