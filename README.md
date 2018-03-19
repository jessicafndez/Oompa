Oompa App

- Para iniciar npm start / npm run build.
- Fichero de inicio en app/app.js
- Fichero JS:
    - Versión actual de scripts (./js): 
        - oompaList.js (pantalla inicial de lista de oompas).
        - oompaSingle.js (pantalla de oompa en solitario).
    - Versión (./js/es6):
        - scripts en classes con es6. No en funcionamiento actual
            habia un bug que no pude resolver de sincronismo entre
            el scroll y las consultas a la API. Creo que al declara
            el "this.isScrollable" en el ajax no hacia efecto por
            un pequeño desfase entre el scroll y la llamada a la función
            de llamada a la API. He provado con async/await sin mucho exito en el resultado.
            Por eso dejo activa la versión de funcionos/jQuery, que al
            ser las variables mas directas no tenia problemas de sincronismo.

Notas sobre la versión:
    - No sabia si el buscador tenia que mostrar instantaneamente los
        resultados del input, por tanto hay 2 versiones:
            - actualiza lista con cada letra que entramos.
            - actualiza lista solo al apretar boton de buscador.
        Actualmente estan las 2 activas, a elegir la correcta o la 
        mejor, solo hace falta desactivar una de las 2 funciones.

    - Hay un boton para subir al principio de la pagina de la
        lista de oompas.
    
    - Para ir a la vista del oompa, apretamos en el nombre del oompa,
        aunque tambien se podria implementar al clicar imagen.
        - Para navegar a la vista del oompa en solitario, utilizo 
            un pushState para cambiar la url.
        Esto provoca un error si intentamos actualizar la pantalla cuando
        nos encontrams en /{id}, tenemos un 404 y se quedaría todo colgado. Para solucionarlo he redireccionado el 404 en el
        htaccess a la pantalla de inicio. Asi, aunque estemos en '/{id}',
        al actualizar iremos a '/'.
    
    - Al redireccionar atras, si hay alguna lista que teniamos de resultados, los oompa que mostraran seran la lista guardada.
    Se utiliza una variable de session. Se rellena el input del buscador.

    - Al final de la pagina llama de nuevo a la API y pinta los resultados a continuacion del ultimo oompa.

    - He utilizado 3 plantillas para pintar los oompas.
        - Plantilla general de vista de lista de oompas.
        - Plantilla para resultados, pos si tubiera que añadir algo mas,
            que no sea exactamente igual a la genera de lista.
        - Plantilla de vista del oompa en solitario.

    - Caso de error no solucionado: mostrar mensaje para cuando ya no
        haya mas oompas, es decir estemos en la pagina maxima. Pondriamos
        un mensaje al final de la lista.
