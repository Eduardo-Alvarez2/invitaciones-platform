from marshmallow import Schema, fields, validate

class ConfirmacionSchema(Schema):
    id = fields.Int(dump_only=True)
    evento_id = fields.Int(dump_only=True)
    nombre = fields.Str(required=True, validate=validate.Length(min=2))
    telefono = fields.Str(required=True, validate=validate.Length(max=20))
    cantidad = fields.Int(required=True, validate=validate.Range(min=1, max=10))
    asiste = fields.Bool(required=True)
    mensaje = fields.Str()
    fecha_confirmacion = fields.DateTime(dump_only=True)