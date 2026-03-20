import re
import unicodedata
from models.evento import Evento


def quitar_acentos(texto):
    texto = unicodedata.normalize('NFKD', texto)
    texto = texto.encode('ascii', 'ignore').decode('ascii')
    return texto


def generar_slug(nombre):
    slug = nombre.lower()

    # quitar acentos
    slug = quitar_acentos(slug)

    # eliminar caracteres raros
    slug = re.sub(r"[^\w\s-]", "", slug)

    # espacios → guiones
    slug = re.sub(r"\s+", "-", slug)

    return slug.strip("-")


def generar_slug_unico(nombre):
    base_slug = generar_slug(nombre)
    slug = base_slug
    contador = 1

    while Evento.query.filter_by(slug=slug).first():
        slug = f"{base_slug}-{contador}"
        contador += 1

    return slug