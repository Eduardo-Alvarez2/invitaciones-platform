import re
from models.evento import Evento

def generar_slug(nombre):
    slug = nombre.lower()
    slug = re.sub(r"[^\w\s-]", "", slug)  # elimina caracteres raros
    slug = re.sub(r"\s+", "-", slug)      # espacios → guiones
    return slug.strip("-")

def generar_slug_unico(nombre):
    base_slug = generar_slug(nombre)
    slug = base_slug
    contador = 1

    while Evento.query.filter_by(slug=slug).first():
        slug = f"{base_slug}-{contador}"
        contador += 1

    return slug