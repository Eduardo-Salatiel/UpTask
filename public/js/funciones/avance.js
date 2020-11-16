import Swal from "sweetalert2";

export const avanceProyecto = ( )  => {
    //SELECCIONAR LAS TAREAS
    const tareas = document.querySelectorAll('li.tarea');

    if (tareas.length) {
        //SELECCIONAR LAS TAREAS COMPLETAS
        const tareasCompletadas = document.querySelectorAll('i.completo')

        //CALCULAR EL AVANCE
        const avance = Math.round((tareasCompletadas.length / tareas.length) * 100);

        //MOSTRAR EL AVANCE
        const porcentaje = document.querySelector('#porcentaje');
        porcentaje.style.width = avance + '%';

        if(avance === 100){
            Swal.fire(
                'Completaste el Proyecto',
                'Felicidades haz terminado tus tareas',
                'success'
            )
        }
        
    }

}