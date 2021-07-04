import { useState, useEffect, useCallback } from "react";
import { BiCalendar } from "react-icons/bi";
import Search from "./components/Search";
import AddAppointment from "./components/AddAppointment";
import AppointmentInfo from "./components/AppointmentInfo";

function App() {
   const [appointmentList, setAppointmentList] = useState(
      []
   );
   const [query, setQuery] = useState("");
   const [sortBy, setSortBy] = useState("petName");
   const [orderBy, setOrderBy] = useState("asc");
   const filteredAppointments = appointmentList
      .filter((item) => {
         return (
            item.petName
               .toLowerCase()
               .includes(query.toLowerCase()) ||
            item.ownerName
               .toLowerCase()
               .includes(query.toLowerCase()) ||
            item.aptNotes
               .toLowerCase()
               .includes(query.toLowerCase())
         );
      })
      .sort((a, b) => {
         let order = orderBy === "asc" ? 1 : -1;
         return a[sortBy].toLowerCase() <
            b[sortBy].toLowerCase()
            ? order * -1
            : order * 1;
      });

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
      fetchData();
   }, [fetchData]);

   const deleteAppointment = (appointmentId) => {
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
         <AddAppointment
            onSendAppointment={(newAppt) =>
               setAppointmentList([
                  ...appointmentList,
                  newAppt
               ])
            }
            lastId={appointmentList.reduce(
               (max, item) =>
                  Number(item.id) > max
                     ? Number(item.id)
                     : max,
               0
            )}
         />
         <Search
            query={query}
            onQueryChange={(myQuery) => setQuery(myQuery)}
            orderBy={orderBy}
            onOrderByChange={(newOrder) =>
               setOrderBy(newOrder)
            }
            sortBy={sortBy}
            onSortByChange={(newSort) => setSortBy(newSort)}
         />
         <ul className="divide-y divide-gray-200">
            {filteredAppointments.map((appointment) => (
               <AppointmentInfo
                  key={appointment.id}
                  id={appointment.id}
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
