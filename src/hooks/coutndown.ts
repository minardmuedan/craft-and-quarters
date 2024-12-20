import { useEffect, useState } from 'react'

export const useCountDown = (initialTime = 0) => {
  const [time, setTime] = useState(initialTime)

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (time > 0)
      intervalId = setInterval(() => {
        setTime(prevTime => prevTime - 1)
      }, 1000)

    return () => clearInterval(intervalId)
  }, [time, setTime])

  return { time, setTime }
}
