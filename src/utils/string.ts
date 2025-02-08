export function toKebabCase(str: string): string {
  return str
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^a-zA-Z0-9-]/g, "") // Remove all non-alphanumeric characters except -
    .toLocaleLowerCase();
}
