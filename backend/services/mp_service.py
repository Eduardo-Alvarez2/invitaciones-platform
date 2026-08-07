import mercadopago
from flask import current_app

class MercadoPagoService:
    
    @classmethod
    def _get_sdk(cls):
        token = current_app.config.get("MP_ACCESS_TOKEN")
        if not token:
            raise RuntimeError("Configuración de Mercado Pago ausente (MP_ACCESS_TOKEN)")
        return mercadopago.SDK(token)

    @classmethod
    def crear_preferencia(cls, evento):
        """
        Genera la preferencia de pago para una invitación específica.
        """
        sdk = cls._get_sdk()
        
        # 💡 Base URL de producción
        BASE_URL = "https://invitto.cloud"
        
        preference_data = {
            "items": [
                {
                    "title": f"Activación Invitación: {evento.nombre}",
                    "quantity": 1,
                    "unit_price": float(current_app.config.get("PRECIO_INVITACION", 30000.0)),
                    "currency_id": "ARS"
                }
            ],
            # ✅ Redirecciones a tu dominio de producción con HTTPS
            "back_urls": {
                "success": f"{BASE_URL}/dashboard/evento/{evento.id}?pago=exitoso",
                "failure": f"{BASE_URL}/checkout/{evento.id}?pago=fallido",
                "pending": f"{BASE_URL}/dashboard/evento/{evento.id}?pago=pendiente"
            },
            "auto_return": "approved",
            "external_reference": str(evento.id),
            
            # 🚨 CRÍTICO: URL pública oficial en tu VPS para recibir la confirmación de MP
            "notification_url": f"{BASE_URL}/api/webhook-pago"
        }

        preference_result = sdk.preference().create(preference_data)
        
        if preference_result["status"] >= 400:
            raise Exception(f"Mercado Pago rechazó la solicitud: {preference_result['response']}")
            
        return preference_result["response"]

    @classmethod
    def consultar_pago(cls, payment_id):
        """
        Consulta el estado real de una transacción mediante su ID de pago.
        """
        sdk = cls._get_sdk()
        payment_info = sdk.payment().get(payment_id)
        
        if payment_info["status"] not in [200, 201]:
            raise Exception(f"Error al consultar pago en MP: {payment_info['status']}")
            
        return payment_info["response"]