from marshmallow import Schema, fields, validate
from schema.cronograma_schema import CronogramaSchema
from schema.imagen_evento_schema import ImagenEventoSchema

class EventoSchema(Schema):
    id = fields.Int(dump_only=True)

    nombre = fields.Str(
        required=True, 
        error_messages={"required": "El nombre del evento es obligatorio."},
        validate=validate.Length(
            min=3, 
            max=120, 
            error="El nombre debe tener entre {min} y {max} caracteres."
        )
    )
    
    fecha = fields.DateTime(
        required=True,
        error_messages={
            "required": "La fecha y hora del evento son obligatorias.",
            "invalid": "El formato de la fecha no es válido."
        }
    )
    
    lugar = fields.Str(
        required=True, 
        error_messages={"required": "El lugar del evento es obligatorio."},
        validate=validate.Length(
            min=3, 
            max=150, 
            error="El nombre del lugar debe tener entre {min} y {max} caracteres."
        )
    )
    
    direccion = fields.Str(
        required=True, 
        error_messages={"required": "La dirección exacta es obligatoria."},
        validate=validate.Length(
            min=5, 
            max=200, 
            error="La dirección debe tener entre {min} y {max} caracteres."
        )
    )
    
    mensaje_principal = fields.Str(
        validate=validate.Length(
            max=500, 
            error="El mensaje principal no puede superar los {max} caracteres."
        )
    )
    
    imagen_portada = fields.Str()
    slug = fields.Str(dump_only=True, validate=validate.Length(min=3, max=150))
    activo = fields.Bool()
    template = fields.Str()

    # 💳 CAMPOS DE PAGO (Agregados para que Marshmallow los incluya en el JSON)
    pagado = fields.Bool()
    status_pago = fields.Str()
    payment_id = fields.Str()

    # Relaciones
    cronograma = fields.Nested(CronogramaSchema, many=True, dump_only=True)
    imagenes = fields.Nested(ImagenEventoSchema, many=True, dump_only=True)
