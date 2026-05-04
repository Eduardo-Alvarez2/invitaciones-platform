import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventoById } from '../../services/EventService';
import axios from 'axios';
import { Check, Rocket, ExternalLink, CreditCard, Loader2 } from 'lucide-react';

const API_URL = "http://localhost:5000/api";

function Checkout() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [evento, setEvento] = useState(null);
    const [loadingPago, setLoadingPago] = useState(false);

    useEffect(() => {
        const cargar = async () => {
            const data = await getEventoById(id);
            setEvento(data);
            if (data.pagado) navigate(`/dashboard/evento/${id}`);
        };
        cargar();
    }, [id]);

    const handlePagar = async () => {
        setLoadingPago(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(`${API_URL}/eventos/${id}/pagar`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Mercado Pago nos devuelve una URL (init_point)
            window.location.href = res.data.init_point;
        } catch (error) {
            alert("Error al iniciar el pago");
        } finally {
            setLoadingPago(false);
        }
    };

    if (!evento) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
                <div className="bg-indigo-600 p-8 text-center text-white">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Rocket size={32} />
                    </div>
                    <h1 className="text-2xl font-bold">¡Casi está lista!</h1>
                    <p className="text-indigo-100 text-sm mt-2">Tu invitación "{evento.nombre}" fue creada con éxito.</p>
                </div>

                <div className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-gray-600">
                            <div className="bg-green-100 p-1 rounded-full"><Check size={14} className="text-green-600" /></div>
                            <span className="text-sm">Diseño Premium Activado</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                            <div className="bg-green-100 p-1 rounded-full"><Check size={14} className="text-green-600" /></div>
                            <span className="text-sm">Galería de fotos incluida</span>
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

                    <button 
                        onClick={handlePagar}
                        disabled={loadingPago}
                        className="w-full bg-black text-white rounded-2xl py-4 font-bold text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        {loadingPago ? <Loader2 className="animate-spin" /> : (
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
    );
}

export default Checkout;