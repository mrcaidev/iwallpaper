type SnakeToCamelString<S> = S extends `${infer First}_${infer Rest}`
  ? `${Lowercase<First>}${Capitalize<SnakeToCamelString<Rest>>}`
  : S;

type SnakeToCamel<T> = T extends (infer Item)[]
  ? SnakeToCamel<Item>[]
  : T extends object
  ? { [Key in keyof T as SnakeToCamelString<Key>]: SnakeToCamel<T[Key]> }
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

export function snakeToCamel<T>(target: T): SnakeToCamel<T> {
  if (Array.isArray(target)) {
    return target.map((item) => snakeToCamel(item)) as SnakeToCamel<T>;
  }

  if (isObject(target)) {
    return Object.entries(target).reduce((acc, [key, value]) => {
      return { ...acc, [snakeToCamelString(key)]: snakeToCamel(value) };
    }, {} as SnakeToCamel<T>);
  }

  return target as SnakeToCamel<T>;
}

function isObject(target: unknown): target is Record<string, unknown> {
  return Object.prototype.toString.call(target) === "[object Object]";
}
