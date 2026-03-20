from marshmallow import Schema, fields

class CronogramaSchema(Schema):
    id = fields.Int(dump_only=True)
    hora = fields.Str()
    titulo = fields.Str()
    descripcion = fields.Str()