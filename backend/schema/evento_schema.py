from marshmallow import Schema, fields, validate
from schema.cronograma_schema import CronogramaSchema
from schema.imagen_evento_schema import ImagenEventoSchema

class EventoSchema(Schema):
    id = fields.Int(dump_only=True)

    nombre = fields.Str(required=True, validate=validate.Length(min=3, max=120))
    fecha = fields.DateTime(required=True)
    lugar = fields.Str(required=True, validate=validate.Length(min=3, max=150))
    direccion = fields.Str(required=True, validate=validate.Length(min=5, max=200))
    mensaje_principal = fields.Str(validate=validate.Length(max=500))
    imagen_portada = fields.Str()
    slug = fields.Str(dump_only=True, validate=validate.Length(min=3, max=150))
    activo = fields.Bool()
    template = fields.Str()
    cronograma = fields.Nested(CronogramaSchema, many=True, dump_only=True)
    imagenes = fields.Nested(ImagenEventoSchema, many=True, dump_only=True)
