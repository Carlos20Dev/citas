import React, { useEffect, useState } from "react";
import axios from "axios";
import { set, useForm } from "react-hook-form";
import SelectField from "./SelectField";

const AppointmentForm = () => {
  const [especialidades, setEspecialidades] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [selectSpeciality, setSelectEspeciality] = useState(null);
  const [selectMedic, setSelectMedic] = useState(null);
  const [selectTurno, setSelectTurno] = useState(null);

  const { handleSubmit, setValue, reset } = useForm();

  const API = "https://citasmedicasutp.onrender.com/api";

  // Fetch especialidades desde la API
  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const response = await axios.get(`${API}/especialidad`);
        const options = response.data.map((spec) => ({
          value: spec.id_espec,
          label: spec.nombre,
        }));
        setEspecialidades(options);
      } catch (error) {
        console.log("Error al obtener las especialidades", error);
      }
    };
    fetchEspecialidades();
  }, []);

  // Fetch medicos según la especialidad
  useEffect(() => {
    if (selectSpeciality) {
      const fetchMedicos = async () => {
        try {
          const response = await axios.get(`${API}/medico/especialidad/${selectSpeciality.value}`)
          const options = response.data.map((doc) => ({
            value: doc.id_medico,
            label: `${doc.nombre} ${doc.apellido}`,
          }));
          setMedicos(options);
        } catch (error) {
          console.error("Error a obtener los médicos", error);
        }
      };
      fetchMedicos();
    }
  }, [selectSpeciality]);

  // Fetch turno según medico
  useEffect(() => {
    if (selectMedic) {
      const fetchTurno = async () => {
        try {
            const response = await axios.get(`${API}/turno/medico/${selectMedic.value}`);
    
            // Formatear los datos obtenidos
            const options = response.data.map((turn) => {
              // Formatear fecha
              const fecha = new Date(turn.fecha).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              });
    
              // Formatear hora de inicio y fin
              const horaInicio = new Date(turn.hora_inicio).toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              });
    
              const horaFin = new Date(turn.hora_fin).toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              });
              const idTurno = turn.id_rt
              console.log(idTurno)
              // Retornar los datos formateados
              return {
                value: turn.id_rt,
                label: `${fecha} (${horaInicio} - ${horaFin})`, // Mostrar fecha y rango de horario
              };
            });
    
            setTurnos(options); // Actualizar el estado con los datos formateados
          } catch (error) {
            console.log("Error al obtener los turnos", error);
          }
      };
      fetchTurno();
    }
  }, [selectMedic]);

  //Handle form submission
  // const onSubmit = async () => {
  //   try {
  //     const response = await axios.post(`${API}/citas`, {
  //       estado: "",
  //       id_user: "",
  //       id_rt: selectTurno.value,
  //     });

  //     alert("Cita registrada");
  //     reset();
  //     setSelectEspeciality(null);
  //     setSelectMedic(null);
  //     setSelectTurno(null);
  //   } catch (error) {
  //     console.log("Error al registrar la cita", error);
  //     alert("Error al registar la cita");
  //   }
  // };

  const onSubmit = async () => {

    let contador = 0
    try {
      // Obtener información del turno seleccionado
      const turnoResponse = await axios.get(`${API}/turno/${selectTurno.value}`)
      const turnoData = turnoResponse.data
      let estado = "Rechazado"

      // Validación de numero de pacientes en ese horario
      if (turnoData.num_pacientes > 0){
        estado = "Aprobado"

        // Actualizar numero de pacientes
        await axios.put(`${API}/turno/${selectTurno.value}`, {
          num_pacientes: turnoData.num_pacientes - 1,
          id_medico: turnoData.id_medico,
          id_horario: turnoData.id_horario,
        })

        contador++
      }

      console.log(contador)
      // Registrar cita
      const response = await axios.post(`${API}/citas`, {
        estado: estado,
        id_user: 6,
        id_rt: selectTurno.value,
      })

      alert(`Cita registrada con estado: ${estado}`)
      reset()
      setSelectEspeciality(null)
      setSelectMedic(null)
      setSelectTurno(null)
    } catch (error) {
      console.error("Error al registrar la cita: ",error)
      alert("Error al registrar la cita")
    }
  }



  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Registrar Cita Médica</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Especialidad
          </label>
          <SelectField
            options={especialidades}
            onChange={(selected) => setSelectEspeciality(selected)}
            placeholder="Selecciona una especialidad"
            value={selectSpeciality}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Médico
          </label>
          <SelectField
            options={medicos}
            onChange={(selected) => setSelectMedic(selected)}
            placeholder="Selecciona un médico"
            value={selectMedic}
            isDisabled={!selectSpeciality}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Turno
          </label>
          <SelectField
            options={turnos}
            onChange={(selected) => setSelectTurno(selected)}
            placeholder="Selecciona un turno"
            value={selectTurno}
            isDisabled={!selectMedic}
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Registrar Cita
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;
