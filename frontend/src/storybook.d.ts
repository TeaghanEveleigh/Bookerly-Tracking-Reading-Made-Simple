declare module '@storybook/react' {
  export type Meta<T = unknown> = {
    title?: string;
    component?: T;
    decorators?: Array<(Story: unknown) => React.ReactNode>;
    [key: string]: unknown;
  };

  export type StoryObj<T = unknown> = {
    args?: unknown;
    [key: string]: unknown;
  };
}
