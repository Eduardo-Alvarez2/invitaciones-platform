import CountdownClassic from "./styles/CountdownClassic"
import CountdownModern from "./styles/CountdownModern"
import CountdownMinimal from "./styles/CountdownMinimal"
import { useState, useEffect } from "react"

function CountdownSection({ fecha, variant = "classic" }) {

  const calculateTimeLeft = () => {
    const eventDate = new Date(fecha)
    const now = new Date()
    const difference = eventDate - now

    if (difference <= 0) return null

    return {
      dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
      horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutos: Math.floor((difference / (1000 * 60)) % 60),
      segundos: Math.floor((difference / 1000) % 60),
    }
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [fecha])

  if (variant === "classic") {
    return <CountdownClassic timeLeft={timeLeft} />
  }

  if (variant === "modern") {
    return <CountdownModern timeLeft={timeLeft} />
  }

  if (variant === "minimal") {
    return <CountdownMinimal timeLeft={timeLeft} />
  }

  return <CountdownClassic timeLeft={timeLeft} />
}

export default CountdownSection