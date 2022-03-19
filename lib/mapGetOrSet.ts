/**
 * Gets a value for a given key in a map, setting the fallback value if it doesn't exist.
 */
const mapGetOrSet = <K, V>(map: Map<K, V>, key: K, getFallback: () => V): V => {
  if (map.has(key)) return map.get(key) as V
  const value = getFallback()
  map.set(key, value)
  return value
}

export default mapGetOrSet
