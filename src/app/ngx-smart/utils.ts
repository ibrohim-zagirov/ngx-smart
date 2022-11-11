
export const select = <T>(data: T, path: string | string[]) =>
  Array.isArray(path)
    ? path
    : path.split('.').
        // @ts-ignore // todo fix after
        reduce((acc, x) => acc[x], data);
