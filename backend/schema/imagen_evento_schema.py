from marshmallow import Schema, fields

class ImagenEventoSchema(Schema):
    id = fields.Int(dump_only=True)
    url_imagen = fields.Str()