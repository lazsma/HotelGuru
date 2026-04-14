import './App.css'

function App() {
  async function create_reservation(event: any) {
    event.preventDefault();
    const sample = {
      user_id: 1,
      room_id: 1,
      check_in_date: "2026-04-14",
      check_out_date: "2026-04-15"
    }
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sample)
    };

    return fetch('/api/reservation/create', requestOptions)
        .then(response => response.json())
        .then(response => console.log(response))
  }

  return (
    <>
      <section id="center">
        <div>
          <h1>Home Page</h1>
        </div>
        
        <form id="reservation-form" onSubmit={create_reservation}>
          <label htmlFor="userid">User Id</label>
          <input id="userid" name="userid" type="text" defaultValue="1"/>
          <br/>

          <label htmlFor="roomid">Room Id</label>
          <input id="roomid" name="roomid" type="text" defaultValue="1"/>
          <br/>

          <label htmlFor="checkin">Check In Date</label>
          <input id="checkin" name="checkin" type="date" defaultValue="2026-04-14" />
          <br/>
          
          <label htmlFor="checkout">Check Out Date</label>
          <input id="checkout" name="checkout" type="date" defaultValue="2026-04-14" />
          <br/>

          <input id="form-button" type="submit" value="Create" />  
        </form>
      </section>


      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
