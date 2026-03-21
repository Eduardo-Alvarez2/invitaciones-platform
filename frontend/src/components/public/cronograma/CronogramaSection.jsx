import CronogramaClassic from "./styles/CronogramaClassic"
import CronogramaModern from "./styles/CronogramaModern"

function CronogramaSection({ items = [], variant = "classic" }) {

  if (!items || items.length === 0) {
    return null
  }

  switch (variant) {

    case "classic":
      return <CronogramaClassic items={items} />
    case "modern":
      return <CronogramaModern items={items} />
    // case "minimal":
    //   return <CronogramaMinimal items={items} />

    default:
      return <CronogramaClassic items={items} />

  }

}

export default CronogramaSection