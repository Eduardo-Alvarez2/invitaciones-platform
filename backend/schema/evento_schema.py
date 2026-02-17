from marshmallow import Schema, fields, validate

class EventoSchema(Schema):
    id = fields.Int(dump_only=True)

    nombre = fields.Str(required=True, validate=validate.Length(min=3, max=120))
    fecha = fields.Date(required=True)
    lugar = fields.Str(required=True, validate=validate.Length(min=3, max=150))
    direccion = fields.Str(required=True, validate=validate.Length(min=5, max=200))
    mensaje_principal = fields.Str(validate=validate.Length(max=500))
    imagen_portada = fields.Str()
    slug = fields.Str(dump_only=True, validate=validate.Length(min=3, max=150))
    activo = fields.Bool()
