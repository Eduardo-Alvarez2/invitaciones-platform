import DetailsClassic from "./styles/DetailsClassic"
import DetailsModern from "./styles/DetailsModern"

function DetailsSection({ lugar, direccion, variant = "classic" }) {

  if (variant === "classic") {
    return <DetailsClassic lugar={lugar} direccion={direccion} />
  }
  if (variant === "modern") {
    return <DetailsModern lugar={lugar} direccion={direccion} />
  }

  return <DetailsClassic lugar={lugar} direccion={direccion} />
}

export default DetailsSection