import { useState } from "react";
import '../App.css'
import { useNavigate } from "react-router";

function BookReservation() {
    const today = new Date().toISOString().split("T")[0];

    const getNextDay = (date: string) => {
        const d = new Date(date);
        d.setDate(d.getDate() + 1);
        return d.toISOString().split("T")[0];
    };

    const [formData, setFormData] = useState({
        user_id: 1, //TODO: logged in user id
        room_id: 1, // TODO: selected room id
        check_in_date: today,
        check_out_date: getNextDay(today),
        people: 1
    });

    const navigate = useNavigate(); 


    const handleChange = (e: any) => {
        const { name, value } = e.target;

        setFormData((prev) => {
            let updated = { ...prev, [name]: value };

            if (name === "check_in_date") {
            if (updated.check_out_date && updated.check_out_date <= value ) {
                updated.check_out_date = getNextDay(value);
            }
            }

            return updated;
        });
    };

    async function create_reservation(event: any) {
        event.preventDefault();

        const jsonData = JSON.stringify(formData);
        console.log(jsonData);

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: jsonData
        };

        return fetch('/api/reservation/create', requestOptions)
            .then(response => response.json())
            .then(() => navigate("/profile"))
            .then(response => console.log(response))
    }

    return (
        <>
            <section id="center">
            <div>
                <h1>Book reservation</h1>
            </div>
            
            <form id="reservation-form" onSubmit={create_reservation}>
                <label htmlFor="user_id">User Id</label>
                <input 
                id="user_id" name="user_id" type="text" 
                value={formData.user_id} onChange={handleChange}/>
                <br/>

                <label htmlFor="room_id">Room Id</label>
                <input 
                id="room_id" name="room_id" type="text" 
                value={formData.room_id} onChange={handleChange}/>
                <br/>

                <label htmlFor="check_in_date">Check In Date</label>
                <input 
                id="check_in_date" name="check_in_date" type="date" 
                value={formData.check_in_date} min={today} onChange={handleChange}/>
                <br/>
                
                <label htmlFor="check_out_date">Check Out Date</label>
                <input 
                id="check_out_date" name="check_out_date" type="date" 
                value={formData.check_out_date} min={getNextDay(formData.check_in_date)} onChange={handleChange}/>
                <br/>

                <label htmlFor="people">Number of people</label>
                <input 
                id="people" name="people" type="text" 
                value={formData.people} onChange={handleChange}/>
                <br/>

                <input id="form-button" type="submit" value="Create" />  
            </form>
            </section>


            <div className="ticks"></div>
            <section id="spacer"></section>
        </>
    )
}

export default BookReservation
