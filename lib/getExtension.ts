const getExtension = (extensions: string[], file: string): string | undefined =>
  extensions.find(extension => file.endsWith(extension))

export default getExtension
