import DetailsClassic from "./styles/DetailsClassic"
import DetailsModern from "./styles/DetailsModern"
import DetailsMinimal from "./styles/DetailsMinimal"

function DetailsSection({ lugar, direccion, variant = "classic" }) {

  if (variant === "classic") {
    return <DetailsClassic lugar={lugar} direccion={direccion} />
  }
  if (variant === "modern") {
    return <DetailsModern lugar={lugar} direccion={direccion} />
  }
  if (variant === "minimal") {
    return <DetailsMinimal lugar={lugar} direccion={direccion} />
  }

  return <DetailsClassic lugar={lugar} direccion={direccion} />
}

export default DetailsSection