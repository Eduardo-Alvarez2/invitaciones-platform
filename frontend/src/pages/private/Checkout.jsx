import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventoById } from '../../services/EventService';
import axios from 'axios';
import { Check, Rocket, ExternalLink, CreditCard, Loader2, Sparkles, ClipboardCheck } from 'lucide-react';

const API_URL = "http://localhost:5000/api";

function Checkout() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [evento, setEvento] = useState(null);
    const [loadingPago, setLoadingPago] = useState(false);

    useEffect(() => {
        const cargar = async () => {
            try {
                const data = await getEventoById(id);
                setEvento(data);
                // Si ya está pagado, al dashboard directo
                if (data.pagado) {
                    navigate(`/dashboard/evento/${id}`);
                }
            } catch (error) {
                console.error("Error al cargar el evento", error);
                navigate('/dashboard');
            }
        };
        cargar();
    }, [id, navigate]);

    const handlePagar = async () => {
        setLoadingPago(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(`${API_URL}/eventos/${id}/pagar`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.init_point) {
                window.location.href = res.data.init_point;
            } else {
                throw new Error("No se recibió la URL de pago");
            }
        } catch (error) {
            console.error("Error en Mercado Pago:", error);
            alert("Hubo un problema al conectar con Mercado Pago. Intentá nuevamente.");
        } finally {
            setLoadingPago(false);
        }
    };

    if (!evento) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="animate-spin text-indigo-600" size={48} />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
                <div className="bg-indigo-600 p-8 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <Sparkles size={80} />
                    </div>
                    
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <Rocket size={32} />
                    </div>
                    <h1 className="text-2xl font-bold">¡Casi está lista!</h1>
                    <p className="text-indigo-100 text-sm mt-2">
                        Tu invitación <span className="font-bold text-white">"{evento.nombre}"</span> ha sido reservada.
                    </p>
                </div>

                <div className="p-8 space-y-6">
                    <div className="space-y-4">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Tu Pack Premium incluye:</p>
                        
                        <div className="flex items-center gap-3 text-gray-700">
                            <div className="bg-green-100 p-1 rounded-full"><Check size={14} className="text-green-600" /></div>
                            <span className="text-sm font-medium">Diseño Moderno y Responsivo</span>
                        </div>
                        
                        <div className="flex items-center gap-3 text-gray-700">
                            <div className="bg-green-100 p-1 rounded-full"><Check size={14} className="text-green-600" /></div>
                            <span className="text-sm font-medium">Galería de fotos personalizada</span>
                        </div>

                        <div className="flex items-center gap-3 text-gray-700">
                            <div className="bg-green-100 p-1 rounded-full"><Check size={14} className="text-green-600" /></div>
                            <span className="text-sm font-medium">Cronograma interactivo</span>
                        </div>

                        {/* Cambio clave: Confirmación RSVP nativa */}
                        <div className="flex items-center gap-3 text-gray-700">
                            <div className="bg-green-100 p-1 rounded-full"><ClipboardCheck size={14} className="text-green-600" /></div>
                            <span className="text-sm font-medium">Gestión de invitados (RSVP Web)</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <button 
                            onClick={() => window.open(`/preview/${evento.slug}`, '_blank')}
                            className="w-full flex items-center justify-center gap-2 text-indigo-600 font-bold py-3 hover:bg-indigo-50 rounded-xl transition-all"
                        >
                            <ExternalLink size={18} /> Previsualizar Invitación
                        </button>
                    </div>

                    <div className="space-y-3">
                        <button 
                            onClick={handlePagar}
                            disabled={loadingPago}
                            className="w-full bg-black text-white rounded-2xl py-4 font-bold text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:bg-gray-800 disabled:scale-100"
                        >
                            {loadingPago ? (
                                <><Loader2 className="animate-spin" /> Conectando...</>
                            ) : (
                                <>
                                    <CreditCard size={20} />
                                    Pagar y Activar
                                </>
                            )}
                        </button>
                        
                        <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest">
                            Pago seguro vía Mercado Pago
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;