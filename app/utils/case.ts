type SnakeToCamelString<S> = S extends `${infer First}_${infer Rest}`
  ? `${Lowercase<First>}${Capitalize<SnakeToCamelString<Rest>>}`
  : S;

type SnakeToCamelJson<T> = T extends (infer Item)[]
  ? SnakeToCamelJson<Item>[]
  : T extends object
    ? { [Key in keyof T as SnakeToCamelString<Key>]: SnakeToCamelJson<T[Key]> }
    : T;

function snakeToCamelString(text: string) {
  const [first, ...rest] = text.split("_").filter((word) => word.length > 0);

  if (!first) {
    return "";
  }

  const camelWords = [first.toLowerCase()];

  for (const word of rest) {
    camelWords.push(word[0]!.toUpperCase() + word.slice(1).toLowerCase());
  }

  return camelWords.join("");
}

export function snakeToCamelJson<T>(target: T): SnakeToCamelJson<T> {
  if (Array.isArray(target)) {
    return target.map((item) => snakeToCamelJson(item)) as SnakeToCamelJson<T>;
  }

  if (isObject(target)) {
    return Object.entries(target).reduce((acc, [key, value]) => {
      return { ...acc, [snakeToCamelString(key)]: snakeToCamelJson(value) };
    }, {} as SnakeToCamelJson<T>);
  }

  return target as SnakeToCamelJson<T>;
}

function isObject(target: unknown): target is Record<string, unknown> {
  return Object.prototype.toString.call(target) === "[object Object]";
}
