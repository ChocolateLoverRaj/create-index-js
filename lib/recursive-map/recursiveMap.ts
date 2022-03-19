import NestedArray from './NestedArray.js'

const recursiveMap = <TInitial, TModified = TInitial>(
  value: NestedArray<TInitial>,
  mapFn: (initial: TInitial) => TModified
): NestedArray<TModified> => value instanceof Array
    ? value.map(value => recursiveMap(value, mapFn))
    : mapFn(value) as any

export default recursiveMap
