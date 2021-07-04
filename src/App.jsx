import { useState, useEffect, useCallback } from "react";
import { BiCalendar } from "react-icons/bi";
import Search from "./components/Search";
import AddAppointment from "./components/AddAppointment";
import AppointmentInfo from "./components/AppointmentInfo";

function App() {
   const [appointmentList, setAppointmentList] = useState(
      []
   );

   const fetchData = useCallback(async () => {
      const response = await fetch("./data.json", {
         headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
         }
      });
      const data = await response.json();
      setAppointmentList(data);
   }, []);

   useEffect(() => {
      async function callFetch() {
         await fetchData();
      }
      console.log("use effect called");
      callFetch();
   }, [fetchData]);

   const deleteAppointment = (appointmentId) => {
      console.log("deleteAppointment completed");
      setAppointmentList(
         appointmentList.filter(
            (appointment) =>
               appointment.id !== appointmentId
         )
      );
   };

   return (
      <div className="App container mx-auto mt-3 font-thin">
         <h1 className="text-5xl mb-3">
            <BiCalendar className="inline-block text-red-400 align-top mr-3" />
            Your Appointments
         </h1>
         <AddAppointment />
         <Search />
         <ul className="divide-y divide-gray-200">
            {appointmentList.map((appointment) => (
               <AppointmentInfo
                  key={appointment.id}
                  petName={appointment.petName}
                  aptDate={appointment.aptDate}
                  ownerName={appointment.ownerName}
                  aptNotes={appointment.aptNotes}
                  onDeleteAppointment={deleteAppointment}
               />
            ))}
         </ul>
      </div>
   );
}

export default App;
