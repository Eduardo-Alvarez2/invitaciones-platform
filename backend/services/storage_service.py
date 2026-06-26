import os
import uuid
from flask import current_app
from werkzeug.utils import secure_filename
from database import db

class StorageService:
    ALLOWED_IMAGES = {'jpg', 'jpeg', 'png'}
    ALLOWED_AUDIO = {'mp3', 'wav', 'mpeg', 'm4a'}

    @classmethod
    def _allowed_file(cls, filename, allowed_extensions):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

    @classmethod
    def guardar_archivo(cls, file, carpeta_destino, prefijo_nombre, tipo="imagen"):
        """
        Maneja la lógica genérica de guardado de archivos en el disco.
        """
        allowed_ext = cls.ALLOWED_IMAGES if tipo == "imagen" else cls.ALLOWED_AUDIO
        
        if not file or file.filename == '':
            raise ValueError("No se seleccionó ningún archivo válido")

        if not cls._allowed_file(file.filename, allowed_ext):
            raise ValueError(f"Formato de {tipo} no permitido")

        extension = file.filename.rsplit('.', 1)[1].lower()
        nombre_final = f"{prefijo_nombre}.{extension}"
        
        # Ruta absoluta para guardar físicamente
        ruta_base = current_app.config["UPLOAD_FOLDER"]
        carpeta_completa = os.path.join(ruta_base, carpeta_destino)
        os.makedirs(carpeta_completa, exist_ok=True)
        
        ruta_fisica = os.path.join(carpeta_completa, secure_filename(nombre_final))
        file.save(ruta_fisica)

        # Retorna la URL relativa estándar para guardar en BD: /uploads/carpeta/nombre.ext
        return f"/uploads/{carpeta_destino}/{nombre_final}"

    @classmethod
    def eliminar_archivo_fisico(cls, url_relativa):
        """
        Elimina un archivo del disco si existe basándose en su URL de la BD.
        """
        if not url_relativa:
            return
            
        ruta_base = current_app.config["UPLOAD_FOLDER"]
        nombre_real = url_relativa.replace("/uploads/", "")
        ruta_real = os.path.join(ruta_base, nombre_real)
        
        if os.path.exists(ruta_real):
            try:
                os.remove(ruta_real)
            except Exception:
                pass # Evita trabar el flujo si falla el borrado físico