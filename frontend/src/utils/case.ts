type SnakeToCamel<S extends string> = S extends `${infer First}_${infer Rest}`
  ? `${First}${Capitalize<SnakeToCamel<Rest>>}`
  : S;

type SnakeToCamelObject<O> = {
  [Key in keyof O as SnakeToCamel<Key & string>]: O[Key] extends Record<
    string,
    unknown
  >
    ? SnakeToCamelObject<O[Key]>
    : O[Key];
} & {
  // To prettify the type hints.
};

export function snakeToCamel(str: string) {
  const [first, ...rest] = str.split("_").filter((word) => word.length > 0);

  if (!first) {
    return "";
  }

  const camelWords = [first.toLowerCase()];

  for (const word of rest) {
    camelWords.push(word[0]!.toUpperCase() + word.slice(1).toLowerCase());
  }

  return camelWords.join("");
}

export function snakeToCamelObject<T>(obj: T): SnakeToCamelObject<T> {
  if (!isObject(obj)) {
    return obj as SnakeToCamelObject<T>;
  }

  const camelObj: Record<string, unknown> = {};

  for (const key in obj) {
    camelObj[snakeToCamel(key)] = snakeToCamelObject(obj[key]);
  }

  return camelObj as SnakeToCamelObject<T>;
}

function isObject(obj: unknown): obj is Record<string, unknown> {
  return Object.prototype.toString.call(obj) === "[object Object]";
}
