import { useEffect, useState } from 'react';

export default function ReceptionDashboard() {
    const [reservations, setReservations] = useState<any[]>([]);
    
    const [invoiceData, setInvoiceData] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const response = await fetch('/api/receptionist/reservations');
            if (response.ok) {
                const data = await response.json();
                setReservations(data);
            } else {
                console.error("Hiba a foglalások lekérésekor:", await response.text());
            }
        } catch (error) {
            console.error("Hálózati hiba:", error);
        }
    };

    const handleStatusChange = async (id: number, newStatus: string) => {
        try {
            const response = await fetch(`/api/receptionist/reservations/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                setReservations(reservations.map(res =>
                    res.id === id ? { ...res, status: `StatusEnum.${newStatus}` } : res
                ));
            } else {
                console.error("Hiba a státusz frissítésekor:", await response.text());
            }
        } catch (error) {
            console.error("Hálózati hiba:", error);
        }
    };

    const handleGenerateInvoice = async (id: number) => {
        try {
            const response = await fetch(`/api/receptionist/reservations/${id}/invoice`);
            if (response.ok) {
                const data = await response.json();
                setInvoiceData(data);
                setIsModalOpen(true);
            } else {
                console.error("Hiba a számla lekérésekor:", await response.text());
            }
        } catch (error) {
            console.error("Hálózati hiba:", error);
        }
    };

    const formatStatus = (statusStr: string) => {
        if (!statusStr) return "";
        const cleanStatus = statusStr.replace("StatusEnum.", "");
        
        switch(cleanStatus) {
            case 'New': return 'Új';
            case 'Approved': return 'Jóváhagyva';
            case 'Cancelled': return 'Törölve';
            default: return cleanStatus;
        }
    };

    return (
        <div className="reception-dashboard" style={{ padding: '20px', position: 'relative' }}>
            <h2>Recepciós Pult - Foglalások kezelése</h2>
            <table border={1} cellPadding={10} style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f0f0f0', textAlign: 'left' }}>
                        <th>ID</th>
                        <th>Vendég</th>
                        <th>Szoba</th>
                        <th>Érkezés</th>
                        <th>Távozás</th>
                        <th>Státusz</th>
                        <th>Műveletek</th>
                    </tr>
                </thead>
                <tbody>
                    {reservations.map((res) => (
                        <tr key={res.id}>
                            <td>#{res.id}</td>
                            
                            {/* TODO: Majd lecserélni valós nevekre az ID-kat */}
                            <td>User ID: {res.user_id}</td>
                            <td>Room ID: {res.room_id}</td>
                            
                            <td>{res.check_in_date}</td>
                            <td>{res.check_out_date}</td>
                            
                            <td><strong>{formatStatus(res.status)}</strong></td>
                            
                            <td style={{ display: 'flex', gap: '10px' }}>
                                {(res.status === 'New' || res.status === 'StatusEnum.New') && (
                                    <button 
                                        onClick={() => handleStatusChange(res.id, 'Approved')}
                                        style={{ backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
                                    >
                                        Jóváhagy
                                    </button>
                                )}
                                {(res.status === 'Approved' || res.status === 'StatusEnum.Approved') && (
                                    <button 
                                        onClick={() => handleGenerateInvoice(res.id)}
                                        style={{ backgroundColor: '#3498db', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
                                    >
                                        Számla
                                    </button>
                                )}
                                {res.status !== 'Cancelled' && res.status !== 'StatusEnum.Cancelled' && (
                                    <button 
                                        onClick={() => handleStatusChange(res.id, 'Cancelled')} 
                                        style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
                                    >
                                        Mégse
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    {reservations.length === 0 && (
                        <tr>
                            <td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>
                                Jelenleg nincs egyetlen foglalás sem a rendszerben.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {isModalOpen && invoiceData && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', minWidth: '350px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ marginTop: 0, borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>Számla Részletei</h3>
                        <p><strong>Foglalás azonosító:</strong> #{invoiceData.reservation_id}</p>
                        <p><strong>Vendég ID:</strong> {invoiceData.user_id}</p>
                        <p><strong>Szoba ID:</strong> {invoiceData.room_id}</p>
                        
                        <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '5px', marginTop: '20px' }}>
                            <p style={{ margin: '5px 0' }}>Eltöltött éjszakák: <strong>{invoiceData.nights} éj</strong></p>
                            <p style={{ margin: '5px 0' }}>Szállás díja: <strong>{invoiceData.room_cost.toLocaleString()} Ft</strong></p>
                            <p style={{ margin: '5px 0' }}>Extra szolgáltatások: <strong>{invoiceData.extra_cost.toLocaleString()} Ft</strong></p>
                            <hr style={{ border: '1px solid #ddd', margin: '15px 0' }} />
                            <h3 style={{ margin: 0, color: '#e74c3c' }}>Fizetendő: {invoiceData.total_cost.toLocaleString()} Ft</h3>
                        </div>

                        <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button 
                                onClick={() => setIsModalOpen(false)} 
                                style={{ padding: '8px 15px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Bezárás
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}