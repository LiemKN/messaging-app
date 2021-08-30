import { useEffect, useState } from 'react'

const PREFIX = 'messaging-app-'

function useLocalStorage(key, initialValue) {
  const prefixedKey = PREFIX + key
  const [value, setValue] = useState(() => {
    // retrieve from local storage if value of key exists
    const jsonValue = localStorage.getItem(prefixedKey)
    if (jsonValue !== 'undefined' && jsonValue != null)
      return JSON.parse(jsonValue)
    // if initialValue is passed set value as either a function if it's a function or the value as it was passed
    if (typeof initialValue === 'function') {
      return initialValue()
    } else {
      return initialValue
    }
  })

  useEffect(() => {
    localStorage.setItem(prefixedKey, JSON.stringify(value))
  }, [prefixedKey, value])

  return [value, setValue]
}

export default useLocalStorage
