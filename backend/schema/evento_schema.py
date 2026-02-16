from marshmallow import Schema, fields

class EventoSchema(Schema):
    id = fields.Int(dump_only=True)
    nombre = fields.Str(required=True)
    fecha = fields.DateTime(required=True)
    lugar = fields.Str(required=True)
    direccion = fields.Str(required=True)
    mensaje_principal = fields.Str()
    imagen_portada = fields.Str()
    slug = fields.Str(required=True)
    activo = fields.Bool()