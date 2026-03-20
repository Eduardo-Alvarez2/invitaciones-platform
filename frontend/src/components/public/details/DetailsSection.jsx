import DetailsClassic from "./styles/DetailsClassic"

function DetailsSection({ lugar, direccion, variant = "classic" }) {

  if (variant === "classic") {
    return <DetailsClassic lugar={lugar} direccion={direccion} />
  }


  return <DetailsClassic lugar={lugar} direccion={direccion} />
}

export default DetailsSection