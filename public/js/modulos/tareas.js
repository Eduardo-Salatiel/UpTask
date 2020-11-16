import axios from "axios";
import Swal from 'sweetalert2'
import {avanceProyecto} from './../funciones/avance'

const tareas = document.querySelector(".listado-pendientes");

if (tareas) {
  tareas.addEventListener("click", (e) => {
    if (e.target.classList.contains("fa-check-circle")) {
      const icono = e.target;
      const idTarea = icono.parentElement.parentElement.dataset.tarea;

      //PETICION AXIOS
      const url = `${location.origin}/tareas/${idTarea}`;
      axios.patch(url, { idTarea }).then((res) => {
        if (res.status === 200) {
          icono.classList.toggle("completo");
          avanceProyecto();
        }
      });
    }

    if (e.target.classList.contains("fa-trash")) {
      const tareaHTML = e.target.parentElement.parentElement,
        idTarea = tareaHTML.dataset.tarea;
      Swal.fire({
        title: "¿Deseas borrar esta Tarea?",
        text: "Una tarea eliminada no se puede recuperar",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, borrar",
        cancelButtonText: "No, cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
            const url = `${location.origin}/tareas/${idTarea}`;
            console.log(idTarea);
            axios.delete(url, {params: {idTarea}})
                .then((res) => {
                    if (res.status === 200) {
                      tareaHTML.parentElement.removeChild(tareaHTML);
                      avanceProyecto();

                      Swal.fire(
                        'Tarea Eliminada',
                        res.data,
                        'success'
                      )
                      
                    }
                })
        }
      });
    }
  });
}

export default tareas;
