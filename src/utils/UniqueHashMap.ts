
class UniqueHashMap<Key extends IEquality<Key>, Value> {
  constructor(entries?: Iterable<[Key, Value]>, private defaultValue?: Value) {
    if (entries) {
      for (const entry of entries) {
        const [key, value] = entry;
      }
    }
  }
  map: Map<string, [Key, Value]> = new Map();
  length = 0;

  set(key: Key, value: Value): this {
    const hashString = key.hashString();
    const oldValue = this.get(key);
    if (!oldValue) {
      this.length++;
    }
    this.map.set(hashString, [key, value]);
    return this;
  }


  has(key: Key): boolean {
    return this.get(key) !== undefined;
  }

  getDefault(key: Key): Value | undefined {
    return this.get(key) || this.defaultValue;
  }

  /**
   *
   */
  get(key: Key): Value | undefined {
    const hashString = key.hashString();
    const oldKeyValue = this.map.get(hashString);
    if (oldKeyValue) {
      const [oldKey, value] = oldKeyValue;
      if (key.equals(oldKey)) {
        return value;
      } else {
        throw new Error(`${key} has same hashString as ${oldKey}.\n
        It is: "${hashString}". They must be equal, but are not!\n
        `);
      }
    }
    return undefined;
  }
}

interface IEquality<T extends IEquality<T>> {
  /**
   * Implementors have to make sure that if o1.hashString() === o2.hashString(),
   * o1.equals(o2) && o2.equals(o1)
   */
  equals(other: this): boolean;
  hashString(): string;
}
