export type Setter<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};

export function createSetters<T extends object>(
  set: (fn: (prev: Partial<T>) => Partial<T>) => void,
  keys: (keyof T)[]
): Setter<T> {
  const setterEntries = keys.map((key) => {
    const fnName = `set${String(key).charAt(0).toUpperCase()}${String(
      key
    ).slice(1)}`;
    return [fnName, (value: any) => set((prev) => ({ ...prev, [key]: value }))];
  });

  return Object.fromEntries(setterEntries) as Setter<T>;
}
