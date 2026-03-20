import CronogramaClassic from "./styles/CronogramaClassic"

function CronogramaSection({ items = [], variant = "classic" }) {

  if (!items || items.length === 0) {
    return null
  }

  switch (variant) {

    case "classic":
      return <CronogramaClassic items={items} />

    default:
      return <CronogramaClassic items={items} />

  }

}

export default CronogramaSection