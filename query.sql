-- Usuario que se conecta a la base de datos
CREATE ROLE luis WITH LOGIN PASSWORD '1234';

-- Creacion de la base de datos
create table usuarios (
    id varchar(50) primary key,
    nombre varchar(50) not null,
    apellido varchar(50) not null,
    cc varchar(20) unique not null,
    correo varchar(20) unique not null,
    telefono varchar(20) not null,
    contrasena varchar(20) not null,
    rol varchar(20) not null,
    status boolean default true,
    Icono varchar(100)
);

create table auditoria (
    id_auditoria serial primary key,
    id_usuario varchar(50) not null references usuarios(id) on delete cascade,
    fecha timestamp default current_timestamp not null
);

create table salon_eventos (
    id varchar(100) primary key,
    nombre_salon varchar(100) not null,
    dimensiones_area varchar(50),
    capacidad int,
    valor_hora numeric(10, 2),
    url_imagen varchar(255),
    descripcion text,
    estado varchar(20),
    id_usuario varchar(50) references usuarios(id) on delete cascade
);

create table reservas (
    id_reserva varchar(50) primary key,
    id_salon varchar(100) not null references salon_eventos(id) on delete cascade,
    id_usuario varchar(50) not null references usuarios(id) on delete cascade,
    fecha_inicio timestamp not null,
    fecha_final timestamp not null,
    num_personas int not null,
    estado_reserva VARCHAR(20) NOT NULL DEFAULT 'disponible'
);

create table comentarios (
    id varchar(50) primary key,
    id_usuario varchar(50) not null references usuarios(id) on delete cascade,
    id_salon varchar(100) not null references salon_eventos(id) on delete cascade,
    comentario varchar(200),
    calificacion int check (
        calificacion between 1
        and 5
    ),
    fecha timestamp default current_timestamp not null,
    estado VARCHAR(20)
);

-- Procedimiento para la creacion de un usuario
CREATE
OR REPLACE PROCEDURE insertar_usuario(
    p_id varchar(50),
    p_nombre varchar(50),
    p_apellido varchar(50),
    p_cc varchar(20),
    p_correo varchar(20),
    p_telefono varchar(20),
    p_contrasena varchar(20),
    p_rol varchar(20)
) LANGUAGE plpgsql AS $ $ BEGIN -- Verificar si el CC ya existe
IF EXISTS (
    SELECT
        1
    FROM
        usuarios
    WHERE
        cc = p_cc
) THEN RAISE EXCEPTION 'El número de cédula % ya está registrado',
p_cc;

END IF;

-- Verificar si el correo ya existe
IF EXISTS (
    SELECT
        1
    FROM
        usuarios
    WHERE
        correo = p_correo
) THEN RAISE EXCEPTION 'El correo % ya está registrado',
p_correo;

END IF;

-- Insertar usuario si no hay conflictos
INSERT INTO
    usuarios (
        id,
        nombre,
        apellido,
        cc,
        correo,
        telefono,
        contrasena,
        rol
    )
VALUES
    (
        p_id,
        p_nombre,
        p_apellido,
        p_cc,
        p_correo,
        p_telefono,
        p_contrasena,
        p_rol
    );
END;
$ $;

-- Trigger para la auditoria, a la tabla usuarios cuaando se inserta un nuevo usuario
create
or replace function registrar_login() returns trigger as $ $ begin
insert into
    auditoria (id_usuario, fecha)
values
    (new.id, current_timestamp);
return new;
end;
$ $ language plpgsql;

create trigger after_login
after
insert
    on usuarios for each row
    when (new.status = true) execute function registrar_login();


-- Permisos al usuario Luis 
GRANT EXECUTE ON PROCEDURE insertar_usuario TO luis;
GRANT USAGE,  SELECT ON SEQUENCE usuarios_id_seq TO luis;
GRANT INSERT, SELECT ON auditoria TO luis;
GRANT INSERT, SELECT ON usuarios TO luis;

-- Funcion usada para el incio de sesion

CREATE OR REPLACE FUNCTION buscar_usuario(
    p_correo varchar(20),
    p_contrasena varchar(20)
) 
RETURNS TABLE (
    id varchar(50),       
    nombre varchar(50),
    apellido varchar(50),
    cc varchar(20),
    correo varchar(20),
    telefono varchar(20),
    rol varchar(20),
    status boolean,
    Icono      varchar(100)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT u.id, u.nombre, u.apellido, u.cc, u.correo, u.telefono, u.rol, u.status, u.icono
    FROM usuarios u
    WHERE u.correo = p_correo AND u.contrasena = p_contrasena;
END;
$$;

-- Permisos a la funcion
GRANT EXECUTE ON FUNCTION buscar_usuario(varchar, varchar) TO luis;

-- Obtner un Usuario por su id

CREATE OR REPLACE FUNCTION obtener_usuario_por_id(p_id varchar)
RETURNS TABLE(
    usuario_id varchar,
    usuario_nombre varchar,
    usuario_apellido varchar,
    usuario_cc varchar,
    usuario_correo varchar,
    usuario_telefono varchar,
    usuario_contrasena varchar,
    usuario_rol varchar,
    usuario_status boolean,
    usuario_icono varchar
) AS $$
BEGIN
    -- Validar si el usuario existe
    IF NOT EXISTS (SELECT 1 FROM usuarios WHERE usuarios.id = p_id) THEN
        RAISE EXCEPTION 'Usuario con id % no encontrado', p_id;
    END IF;

    -- Retornar los datos del usuario
    RETURN QUERY
    SELECT 
        usuarios.id AS usuario_id,
        usuarios.nombre AS usuario_nombre,
        usuarios.apellido AS usuario_apellido,
        usuarios.cc AS usuario_cc,
        usuarios.correo AS usuario_correo,
        usuarios.telefono AS usuario_telefono,
        usuarios.contrasena AS usuario_contrasena,
        usuarios.rol AS usuario_rol,
        usuarios.status AS usuario_status,
        usuarios.Icono AS usuario_icono
    FROM usuarios
    WHERE usuarios.id = p_id;
END;
$$ LANGUAGE plpgsql;

-- Permisos a la funcion
GRANT EXECUTE ON FUNCTION obtener_usuario_por_id(varchar) TO luis;


-- Proceddimiento para actualizar los datos de un usuario


CREATE OR REPLACE FUNCTION actualizar_usuario(
    p_id varchar,
    p_nombre varchar DEFAULT NULL,
    p_apellido varchar DEFAULT NULL,
    p_cc varchar DEFAULT NULL,
    p_correo varchar DEFAULT NULL,
    p_telefono varchar DEFAULT NULL,
    p_contrasena varchar DEFAULT NULL,
    p_rol varchar DEFAULT NULL,
    p_status boolean DEFAULT NULL,
    p_icono varchar DEFAULT NULL
) 
RETURNS void AS $$
DECLARE
    usuario_existe boolean;
BEGIN
    
    BEGIN
        -- Validar si el usuario existe
        SELECT EXISTS (SELECT 1 FROM usuarios WHERE id = p_id) INTO usuario_existe;

        IF NOT usuario_existe THEN
            RAISE EXCEPTION 'Usuario con id % no encontrado', p_id;
        END IF;

        -- Actualizar los datos del usuario
        UPDATE usuarios
        SET 
            nombre = COALESCE(p_nombre, nombre),
            apellido = COALESCE(p_apellido, apellido),
            cc = COALESCE(p_cc, cc),
            correo = COALESCE(p_correo, correo),
            telefono = COALESCE(p_telefono, telefono),
            contrasena = COALESCE(p_contrasena, contrasena),
            rol = COALESCE(p_rol, rol),
            status = COALESCE(p_status, status),
            Icono = COALESCE(p_icono, Icono)
        WHERE id = p_id;
        
    END;
END;
$$ LANGUAGE plpgsql;


-- Permisos a la funcion y tabla usuarios

GRANT EXECUTE ON FUNCTION actualizar_usuario(
    varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, boolean, varchar
) TO luis;

GRANT SELECT, UPDATE ON TABLE usuarios TO luis;


-- Funcion para obtener todos los salones de un usuario admin 
CREATE OR REPLACE FUNCTION obtener_salones_disponibles(p_id_usuario varchar)
RETURNS TABLE (
    id varchar, -- ID del salón
    nombre_salon varchar,
    dimensiones_area varchar,
    capacidad integer,
    valor_hora numeric,
    url_imagen varchar,
    descripcion text,
    estado varchar,
    id_usuario varchar,
    nombre_usuario varchar
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        se.id AS id, -- Alias explícito para evitar ambigüedad
        se.nombre_salon, 
        se.dimensiones_area, 
        se.capacidad, 
        se.valor_hora, 
        se.url_imagen, 
        se.descripcion, 
        se.estado, 
        se.id_usuario, 
        u.nombre AS nombre_usuario
    FROM 
        salon_eventos AS se
    JOIN 
        usuarios AS u ON se.id_usuario = u.id
    WHERE 
        se.estado = 'Disponible' AND se.id_usuario = p_id_usuario;
END;
$$ LANGUAGE plpgsql;


-- Permisos a la funcion
GRANT EXECUTE ON FUNCTION obtener_salones_disponibles(varchar) TO luis;
GRANT SELECT ON TABLE salon_eventos, usuarios TO luis;


-- Obtener un salon por su id

CREATE OR REPLACE VIEW vista_salon_detalle AS
SELECT 
    s.id,  -- Mantenemos el nombre original 'id'
    s.nombre_salon,
    s.dimensiones_area,
    s.capacidad,
    s.valor_hora,
    s.url_imagen,
    s.descripcion,
    s.estado,
    s.id_usuario,
    u.nombre AS nombre_usuario,
    u.apellido AS apellido_usuario
FROM 
    salon_eventos s
JOIN 
    usuarios u ON s.id_usuario = u.id;


CREATE OR REPLACE FUNCTION obtener_salon_por_id(salon_id_param varchar(100))
RETURNS TABLE (
    id varchar(100),
    nombre_salon VARCHAR(100),
    dimensiones_area VARCHAR(50),
    capacidad INTEGER,
    valor_hora DECIMAL(10,2),
    url_imagen VARCHAR(255),
    descripcion TEXT,
    estado VARCHAR(20),
    id_usuario VARCHAR(50),
    nombre_usuario VARCHAR(50),
    apellido_usuario VARCHAR(50)
) AS $$
BEGIN
    RETURN QUERY 
    SELECT 
        v.id,
        v.nombre_salon,
        v.dimensiones_area,
        v.capacidad,
        v.valor_hora,
        v.url_imagen,
        v.descripcion,
        v.estado,
        v.id_usuario,
        v.nombre_usuario,
        v.apellido_usuario
    FROM vista_salon_detalle v 
    WHERE v.id = salon_id_param;
END;
$$ LANGUAGE plpgsql;

-- Permisos a la funcion
GRANT EXECUTE ON FUNCTION obtener_salon_por_id(varchar) TO luis;
GRANT SELECT ON vista_salon_detalle TO luis;


-- Funcion para obtener todos los salones 

CREATE OR REPLACE FUNCTION obtener_salones_propietarios()
RETURNS TABLE (
    salon_id varchar,
    nombre_salon varchar,
    dimensiones_area varchar,
    capacidad integer,
    valor_hora numeric,
    url_imagen varchar,
    descripcion text,
    estado varchar,
    propietario_id varchar,
    propietario_nombre varchar,
    propietario_apellido varchar,
    propietario_correo varchar,
    propietario_telefono varchar
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id AS salon_id,
        s.nombre_salon,
        s.dimensiones_area,
        s.capacidad,
        s.valor_hora,
        s.url_imagen,
        s.descripcion,
        s.estado,
        u.id AS propietario_id,
        u.nombre AS propietario_nombre,
        u.apellido AS propietario_apellido,
        u.correo AS propietario_correo,
        u.telefono AS propietario_telefono
    FROM 
        salon_eventos s
    JOIN 
        usuarios u ON s.id_usuario = u.id
    WHERE 
        s.estado = 'Disponible'; -- Condición para incluir solo salones disponibles
END;
$$ LANGUAGE plpgsql;

-- Permisos a la funcion y a las tablas
GRANT EXECUTE ON FUNCTION obtener_salones_propietarios() TO luis;
GRANT SELECT ON TABLE salon_eventos, usuarios TO luis;


-- Procedimiento para eliminar un salon por su id
CREATE OR REPLACE PROCEDURE ElimarSalon(salon_id VARCHAR(100))
LANGUAGE plpgsql
AS $$
BEGIN
    -- Verificar si el salón de eventos existe
    IF NOT EXISTS (SELECT 1 FROM salon_eventos WHERE id = salon_id) THEN
        RAISE NOTICE 'El salón con id % no existe.', salon_id;
        RETURN;
    END IF;

    -- Actualizar el estado del salón de eventos a 'No disponible'
    UPDATE salon_eventos
    SET estado = 'No disponible'
    WHERE id = salon_id;

    -- Confirmación de la actualización
    RAISE NOTICE 'El salón con id % ha sido marcado como No disponible.', salon_id;
END;
$$;


-- Permisos al procedimiento
GRANT EXECUTE ON PROCEDURE ElimarSalon(VARCHAR) TO luis;


-- Actualizar un salon de eventos
CREATE OR REPLACE FUNCTION actualizar_salon_eventos(
    p_id VARCHAR(100),
    p_nombre_salon VARCHAR(100),
    p_dimensiones_area VARCHAR(50),
    p_capacidad INT,
    p_valor_hora NUMERIC(10, 2),
    p_url_imagen VARCHAR(255),
    p_descripcion TEXT,
    p_estado VARCHAR(20)
)
RETURNS VOID AS $$
BEGIN
    UPDATE salon_eventos
    SET 
        nombre_salon = COALESCE(p_nombre_salon, nombre_salon),
        dimensiones_area = COALESCE(p_dimensiones_area, dimensiones_area),
        capacidad = COALESCE(p_capacidad, capacidad),
        valor_hora = COALESCE(p_valor_hora, valor_hora),
        url_imagen = COALESCE(p_url_imagen, url_imagen),
        descripcion = COALESCE(p_descripcion, descripcion),
        estado = COALESCE(p_estado, estado)
    WHERE id = p_id;
END;
$$ LANGUAGE plpgsql;

-- Permisos a la funcion y a la tabla
GRANT EXECUTE ON FUNCTION actualizar_salon_eventos(VARCHAR, VARCHAR, VARCHAR, INT, NUMERIC, VARCHAR, TEXT, VARCHAR) TO luis;
GRANT UPDATE ON TABLE salon_eventos TO luis;


-- Funcion para crear un nuevo salón de eventos
CREATE OR REPLACE PROCEDURE insertar_salon_evento(
    p_id varchar(100),
    p_nombre_salon varchar(100),
    p_dimensiones_area varchar(50),
    p_capacidad int,
    p_valor_hora numeric(10, 2),
    p_url_imagen varchar(255),
    p_descripcion text,
    p_estado varchar(20),
    p_id_usuario varchar(50)
)
LANGUAGE plpgsql
AS $$
DECLARE
    usuario_rol varchar(20);
BEGIN
    -- Verificar el rol del usuario
    SELECT rol INTO usuario_rol
    FROM usuarios
    WHERE id = p_id_usuario;

    -- Si el rol no es 'Admin', se lanza un error
    IF usuario_rol IS DISTINCT FROM 'Admin' THEN
        RAISE EXCEPTION 'Permiso denegado. Solo los usuarios con rol Admin pueden crear un salón de eventos.';
    END IF;

    -- Si el usuario es 'Admin', se procede con la inserción
    INSERT INTO salon_eventos (
        id, nombre_salon, dimensiones_area, capacidad, valor_hora, url_imagen, descripcion, estado, id_usuario
    )
    VALUES (
        p_id, p_nombre_salon, p_dimensiones_area, p_capacidad, p_valor_hora, p_url_imagen, p_descripcion, p_estado, p_id_usuario
    );
END;
$$;

-- Permisos al procedimiento y a la tabla
GRANT EXECUTE ON PROCEDURE insertar_salon_evento(varchar, varchar, varchar, int, numeric, varchar, text, varchar, int) TO luis;
GRANT INSERT,SELECT ON salon_eventos TO luis;


-- Obtener estadisticas por Salon de eventos

CREATE OR REPLACE FUNCTION obtener_estadisticas_por_usuario(p_id_usuario VARCHAR)
RETURNS TABLE (
    nombre_salon VARCHAR,
    cantidad_reservas INT,
    total_generado NUMERIC
) AS $$
BEGIN
    -- Verificar si el usuario tiene rol de Admin
    IF NOT EXISTS (
        SELECT 1 
        FROM usuarios 
        WHERE id = p_id_usuario AND rol = 'Admin'
    ) THEN
        RAISE EXCEPTION 'El usuario no tiene permisos para acceder a esta función.';
    END IF;

    -- Ejecutar la consulta principal si el usuario tiene rol válido
    RETURN QUERY
    SELECT 
        s.nombre_salon,
        COUNT(r.id_reserva)::INT AS cantidad_reservas,
        COALESCE(SUM(EXTRACT(EPOCH FROM (r.fecha_final - r.fecha_inicio)) / 3600 * s.valor_hora), 0)::NUMERIC AS total_generado
    FROM 
        salon_eventos s
    LEFT JOIN 
        reservas r ON s.id = r.id_salon
    WHERE 
        s.id_usuario = p_id_usuario
        AND s.estado = 'Disponible'  -- Verificar que el estado del salón sea Disponible
        AND r.estado_reserva = 'disponible' -- Verificar que el estado de la reserva sea Disponible
    GROUP BY 
        s.id, s.nombre_salon
    HAVING 
        COALESCE(SUM(EXTRACT(EPOCH FROM (r.fecha_final - r.fecha_inicio)) / 3600 * s.valor_hora), 0) > 0; -- Filtrar salones con ganancias mayores a 0
END;
$$ LANGUAGE plpgsql;


-- Permisos a la funcion
GRANT EXECUTE ON FUNCTION obtener_estadisticas_por_usuario(VARCHAR) TO luis;

-- Obtener estadisticas por Salon de eventos de los usuarios
CREATE OR REPLACE FUNCTION obtener_detalles_reservas_por_salon(p_id_usuario VARCHAR)
RETURNS TABLE (
    nombre_salon VARCHAR,
    nombre_cliente VARCHAR,
    fecha_reserva DATE,
    monto_pagado NUMERIC
) AS $$
BEGIN
    -- Verificar si el usuario tiene rol de Admin
    IF NOT EXISTS (
        SELECT 1
        FROM usuarios
        WHERE id = p_id_usuario AND rol = 'Admin'
    ) THEN
        RAISE EXCEPTION 'El usuario no tiene permisos para acceder a esta función.';
    END IF;

    -- Ejecutar la consulta principal
    RETURN QUERY
    SELECT 
        s.nombre_salon::VARCHAR,
        (u.nombre || ' ' || u.apellido)::VARCHAR AS nombre_cliente,
        r.fecha_inicio::DATE AS fecha_reserva,
        COALESCE(SUM(EXTRACT(EPOCH FROM (r.fecha_final - r.fecha_inicio)) / 3600 * s.valor_hora), 0)::NUMERIC AS monto_pagado
    FROM 
        salon_eventos s
    INNER JOIN 
        reservas r ON s.id = r.id_salon
    INNER JOIN 
        usuarios u ON r.id_usuario = u.id
    WHERE 
        s.id_usuario = p_id_usuario
        AND s.estado = 'Disponible'            -- Estado del salón debe ser Disponible
        AND r.estado_reserva = 'disponible'    -- Estado de la reserva debe ser Disponible
    GROUP BY 
        s.nombre_salon, u.nombre, u.apellido, r.fecha_inicio, s.valor_hora, r.fecha_final
    HAVING 
        COALESCE(SUM(EXTRACT(EPOCH FROM (r.fecha_final - r.fecha_inicio)) / 3600 * s.valor_hora), 0) > 0
    ORDER BY 
        s.nombre_salon, r.fecha_inicio;
END;
$$ LANGUAGE plpgsql;

-- Permisos a la funcion
GRANT EXECUTE ON FUNCTION obtener_detalles_reservas_por_salon(VARCHAR) TO luis;


-- Obtener reservas por usuarios 
CREATE OR REPLACE FUNCTION obtener_reservas_por_cliente(p_id_usuario VARCHAR)
RETURNS TABLE (
    id_reserva VARCHAR,
    nombre_salon VARCHAR,
    id_salon VARCHAR,
    fecha_inicio TIMESTAMP,
    fecha_final TIMESTAMP,
    num_personas INT,
    estado_reserva VARCHAR,
    valor_hora numeric(10, 2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id_reserva,     -- Devolvemos el ID de la reserva
        s.nombre_salon,   -- Devolvemos el nombre del salón
        r.id_salon,
        r.fecha_inicio,
        r.fecha_final,
        r.num_personas,
        r.estado_reserva,
        s.valor_hora
    FROM 
        reservas r
    JOIN 
        salon_eventos s ON r.id_salon = s.id
    WHERE 
        r.id_usuario = p_id_usuario  -- Filtramos por usuario
        AND r.estado_reserva = 'disponible'  -- Condición del estado
END;
$$ LANGUAGE plpgsql;

-- Permisos a la funcion
GRANT EXECUTE ON FUNCTION obtener_reservas_por_cliente(VARCHAR) TO luis;


-- Eliminar una reserva


CREATE OR REPLACE PROCEDURE eliminarReserva(p_id_reserva VARCHAR(50))
LANGUAGE plpgsql
AS $$
BEGIN
    -- Verificar si la reserva existe
    IF EXISTS (SELECT 1 FROM reservas WHERE id_reserva = p_id_reserva) THEN
        -- Actualizar el estado de la reserva a "no disponible"
        UPDATE reservas
        SET estado_reserva = 'no disponible'
        WHERE id_reserva = p_id_reserva;

        -- Mostrar un mensaje de éxito
        RAISE NOTICE 'Reserva con ID % ha sido marcada como no disponible.', p_id_reserva;
    ELSE
        -- Lanzar un error si la reserva no existe
        RAISE EXCEPTION 'Reserva con ID % no existe.', p_id_reserva;
    END IF;
END;
$$;

-- Permisos al procedimiento y a la tabl
GRANT UPDATE ON reservas TO luis;
GRANT EXECUTE ON PROCEDURE eliminarReserva TO luis;


-- Procedimiento para actualizar una reserva

CREATE OR REPLACE PROCEDURE actualizar_reserva(
    id_reserva_input VARCHAR,
    id_salon_input VARCHAR DEFAULT NULL,
    fecha_inicio_input TIMESTAMP DEFAULT NULL,
    fecha_final_input TIMESTAMP DEFAULT NULL,
    num_personas_input INT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Verificar que la reserva exista
    IF NOT EXISTS (
        SELECT 1
        FROM reservas
        WHERE id_reserva = id_reserva_input -- Cambiar 'id' por 'id_reserva'
    ) THEN
        RAISE EXCEPTION 'La reserva con id % no existe', id_reserva_input;
    END IF;

    -- Si se proporciona un nuevo salón, verificar que exista
    IF id_salon_input IS NOT NULL AND NOT EXISTS (
        SELECT 1
        FROM salon_eventos
        WHERE id = id_salon_input
    ) THEN
        RAISE EXCEPTION 'El salón con id % no existe', id_salon_input;
    END IF;

    -- Verificar conflictos de horario si las fechas se proporcionan
    IF fecha_inicio_input IS NOT NULL AND fecha_final_input IS NOT NULL THEN
        IF EXISTS (
            SELECT 1
            FROM reservas
            WHERE id_salon = COALESCE(id_salon_input, (SELECT id_salon FROM reservas WHERE id_reserva = id_reserva_input)) -- Cambiar 'id' por 'id_reserva'
              AND id_reserva != id_reserva_input -- Cambiar 'id' por 'id_reserva'
              AND (fecha_inicio_input, fecha_final_input) OVERLAPS (fecha_inicio, fecha_final)
        ) THEN
            RAISE EXCEPTION 'Ya existe una reserva para el salón en el horario indicado';
        END IF;
    END IF;

    -- Actualizar la reserva utilizando COALESCE para conservar valores originales si son NULL
    UPDATE reservas
    SET
        id_salon = COALESCE(id_salon_input, id_salon),
        fecha_inicio = COALESCE(fecha_inicio_input, fecha_inicio),
        fecha_final = COALESCE(fecha_final_input, fecha_final),
        num_personas = COALESCE(num_personas_input, num_personas)
    WHERE id_reserva = id_reserva_input; -- Cambiar 'id' por 'id_reserva'

    RAISE NOTICE 'Reserva actualizada correctamente';

END;
$$;

-- Permisos al procedimiento y a la tabla
GRANT EXECUTE ON PROCEDURE actualizar_reserva TO luis;
GRANT SELECT, UPDATE ON TABLE reservas TO luis;


-- Crear una reserva en una sala de eventos


CREATE OR REPLACE PROCEDURE insertar_reserva(
    p_id_reserva VARCHAR(50),
    p_id_salon VARCHAR(100),
    p_id_usuario VARCHAR(50),
    p_fecha_inicio TIMESTAMP,
    p_fecha_final TIMESTAMP,
    p_num_personas INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Verificar si el salón de eventos existe
    IF NOT EXISTS (SELECT 1 FROM salon_eventos WHERE id = p_id_salon) THEN
        RAISE EXCEPTION 'El salón con id % no existe.', p_id_salon;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM usuarios WHERE id = p_id_usuario AND rol <> 'Admin') THEN
      RAISE EXCEPTION 'El usuario con id % no existe o es un administrador, no puede realizar reservas.', p_id_usuario;
    END IF;

    -- Verificar que el salón no tenga una reserva en el rango de fechas especificado
    IF EXISTS (
        SELECT 1
        FROM reservas
        WHERE id_salon = p_id_salon
          AND (
              (p_fecha_inicio >= fecha_inicio AND p_fecha_inicio < fecha_final) OR
              (p_fecha_final > fecha_inicio AND p_fecha_final <= fecha_final) OR
              (p_fecha_inicio <= fecha_inicio AND p_fecha_final >= fecha_final)
          )
    ) THEN
        RAISE EXCEPTION 'El salón ya tiene una reserva en el rango de fechas especificado.';
    END IF;

    -- Insertar la nueva reserva
    INSERT INTO reservas (id_reserva, id_salon, id_usuario, fecha_inicio, fecha_final, num_personas)
    VALUES (p_id_reserva, p_id_salon, p_id_usuario, p_fecha_inicio, p_fecha_final, p_num_personas);

    -- Confirmación de la reserva
    RAISE NOTICE 'Reserva con id % ha sido insertada exitosamente.', p_id_reserva;
END;
$$;


-- Permisos al procedimiento y a la tabla
GRANT EXECUTE ON PROCEDURE insertar_reserva(VARCHAR, VARCHAR, VARCHAR, TIMESTAMP, TIMESTAMP, INT) TO luis;
GRANT SELECT, INSERT ON TABLE reservas TO luis;


-- Funcion para obtener todos los comentarios de un salon
CREATE OR REPLACE FUNCTION obtener_comentarios_por_salon(salon_id VARCHAR(100))
RETURNS TABLE (
    nombre_usuario VARCHAR(50),
    fecha_calificacion TIMESTAMP,
    calificacion INT,
    comentario VARCHAR(200),
    id_usuario VARCHAR(50),  -- Cambié el nombre para evitar confusiones con el ID del comentario
    id_comentario VARCHAR(50) -- Cambié el nombre para representar mejor el ID del comentario
) AS $$
BEGIN
    RETURN QUERY
    SELECT u.nombre, c.fecha, c.calificacion, c.comentario, c.id_usuario, c.id
    FROM comentarios c
    JOIN usuarios u ON c.id_usuario = u.id
    WHERE c.id_salon = salon_id AND c.estado = 'disponible';
END;
$$ LANGUAGE plpgsql;

-- Permisos a la función
GRANT EXECUTE ON FUNCTION obtener_comentarios_por_salon(VARCHAR) TO luis;


-- Procedimiento para agregar un comentario
CREATE OR REPLACE FUNCTION agregar_comentario(
    p_id varchar(50),
    p_id_usuario varchar(50),
    p_id_salon varchar(100),
    p_comentario varchar(200),
    p_calificacion int
)
RETURNS TABLE (
    mensaje varchar,
    success boolean
) AS $$
BEGIN
    -- Verificar que la calificación esté en el rango correcto
    IF p_calificacion < 1 OR p_calificacion > 5 THEN
        RETURN QUERY SELECT 'La calificación debe estar entre 1 y 5'::varchar, false;
        RETURN;
    END IF;

    -- Verificar que el usuario existe
    IF NOT EXISTS (SELECT 1 FROM usuarios WHERE id = p_id_usuario) THEN
        RETURN QUERY SELECT 'El usuario no existe'::varchar, false;
        RETURN;
    END IF;

    -- Verificar que el salón existe
    IF NOT EXISTS (SELECT 1 FROM salon_eventos WHERE id = p_id_salon) THEN
        RETURN QUERY SELECT 'El salón no existe'::varchar, false;
        RETURN;
    END IF;

    -- Insertar el comentario
    INSERT INTO comentarios (id, id_usuario, id_salon, comentario, calificacion, fecha)
    VALUES (p_id, p_id_usuario, p_id_salon, p_comentario, p_calificacion, current_timestamp);

    RETURN QUERY SELECT 'Comentario agregado exitosamente'::varchar, true;

END;
$$ LANGUAGE plpgsql;

-- Dar permisos a Luis a la función y a la tabla
GRANT EXECUTE ON FUNCTION agregar_comentario(varchar, varchar, varchar, varchar, int) TO luis;
GRANT SELECT, INSERT ON comentarios TO luis;


-- Eliminar un comentario 
CREATE OR REPLACE PROCEDURE cambiar_estado_comentario(comentario_id VARCHAR(50))
LANGUAGE plpgsql AS $$
BEGIN
    UPDATE comentarios
    SET estado = 'no disponible'
    WHERE id = comentario_id;
END;
$$;

-- Dar permisos a Luis a la función y a la tabl
GRANT EXECUTE ON PROCEDURE cambiar_estado_comentario(VARCHAR) TO luis;
GRANT UPDATE ON comentarios TO luis; 