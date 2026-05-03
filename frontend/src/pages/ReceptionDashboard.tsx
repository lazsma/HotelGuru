import { useEffect, useState } from 'react';
import './ReceptionDashboard.css';

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
        <div className="reception-dashboard">
            <h2>Recepciós Pult - Foglalások kezelése</h2>
            <table className="reception-table">
                <thead>
                    <tr>
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
                            <td>User ID: {res.user_id}</td>
                            <td>Room ID: {res.room_id}</td>
                            <td>{res.check_in_date}</td>
                            <td>{res.check_out_date}</td>
                            <td><strong>{formatStatus(res.status)}</strong></td>
                            <td className="action-buttons">
                                {(res.status === 'New' || res.status === 'StatusEnum.New') && (
                                    <button className="btn btn-approve" onClick={() => handleStatusChange(res.id, 'Approved')}>
                                        Jóváhagy
                                    </button>
                                )}
                                {(res.status === 'Approved' || res.status === 'StatusEnum.Approved') && (
                                    <button className="btn btn-invoice" onClick={() => handleGenerateInvoice(res.id)}>
                                        Számla
                                    </button>
                                )}
                                {res.status !== 'Cancelled' && res.status !== 'StatusEnum.Cancelled' && (
                                    <button className="btn btn-cancel" onClick={() => handleStatusChange(res.id, 'Cancelled')}>
                                        Mégse
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    {reservations.length === 0 && (
                        <tr>
                            <td colSpan={7} className="empty-row">
                                Jelenleg nincs egyetlen foglalás sem a rendszerben.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {isModalOpen && invoiceData && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="modal-header">Számla Részletei</h3>
                        <p><strong>Foglalás azonosító:</strong> #{invoiceData.reservation_id}</p>
                        <p><strong>Vendég ID:</strong> {invoiceData.user_id}</p>
                        <p><strong>Szoba ID:</strong> {invoiceData.room_id}</p>
                        
                        <div className="modal-details">
                            <p>Eltöltött éjszakák: <strong>{invoiceData.nights} éj</strong></p>
                            <p>Szállás díja: <strong>{invoiceData.room_cost.toLocaleString()} Ft</strong></p>
                            <p>Extra szolgáltatások: <strong>{invoiceData.extra_cost.toLocaleString()} Ft</strong></p>
                            <hr />
                            <h3 className="modal-total">Fizetendő: {invoiceData.total_cost.toLocaleString()} Ft</h3>
                        </div>

                        <div className="modal-footer">
                            <button className="btn-close" onClick={() => setIsModalOpen(false)}>
                                Bezárás
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};