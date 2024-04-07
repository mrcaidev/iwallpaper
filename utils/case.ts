export type SnakeToCamelString<S extends string> =
  S extends `${infer First}_${infer Rest}`
    ? `${Lowercase<First>}${Capitalize<SnakeToCamelString<Rest>>}`
    : Lowercase<S>;

export type SnakeToCamelJson<T> = T extends (infer Item)[]
  ? SnakeToCamelJson<Item>[]
  : T extends object
    ? {
        [Key in keyof T as SnakeToCamelString<Key & string>]: SnakeToCamelJson<
          T[Key]
        >;
      }
    : T;

export function capitalize(input: string): string {
  return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}

export function snakeToCamelString<S extends string>(
  input: S,
): SnakeToCamelString<S> {
  return input
    .split("_")
    .map((word, index) => (index === 0 ? word.toLowerCase() : capitalize(word)))
    .join("") as SnakeToCamelString<S>;
}

export function snakeToCamelJson<T>(input: T): SnakeToCamelJson<T> {
  if (Array.isArray(input)) {
    return input.map((item) => snakeToCamelJson(item)) as SnakeToCamelJson<T>;
  }

  if (isObject(input)) {
    return Object.entries(input).reduce((acc, [key, value]) => {
      return { ...acc, [snakeToCamelString(key)]: snakeToCamelJson(value) };
    }, {} as SnakeToCamelJson<T>);
  }

  return input as SnakeToCamelJson<T>;
}

function isObject(target: unknown): target is object {
  return Object.prototype.toString.call(target) === "[object Object]";
}
