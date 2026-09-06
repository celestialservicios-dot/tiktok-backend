import { query } from '../config/db.js';

/**
 * Registra un nuevo usuario en la base de datos
 */
export const register = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    let { inicio_sesion } = req.body;

    // Validación de campos obligatorios
    if (!username || typeof username !== 'string' || !username.trim()) {
      return res.status(400).json({
        success: false,
        error: 'El campo "username" es obligatorio y debe ser un texto válido.'
      });
    }

    if (!password || typeof password !== 'string' || !password.trim()) {
      return res.status(400).json({
        success: false,
        error: 'El campo "password" es obligatorio.'
      });
    }

    // Normalizar inicio_sesion o deducir si no viene especificado
    if (inicio_sesion && typeof inicio_sesion === 'string') {
      inicio_sesion = inicio_sesion.trim().toLowerCase();
    } else if (req.body.tipo_inicio_sesion && typeof req.body.tipo_inicio_sesion === 'string') {
      inicio_sesion = req.body.tipo_inicio_sesion.trim().toLowerCase();
    } else {
      // Detección automática: si el username parece un teléfono (dígitos, con o sin prefijo +)
      const cleanUsername = username.trim();
      const isPhoneLike = /^(\+?\d{7,15})$/.test(cleanUsername.replace(/[\s-]/g, ''));
      inicio_sesion = isPhoneLike ? 'telefono' : 'usuario';
    }

    // Validar longitudes acorde al esquema de base de datos
    const trimmedUsername = username.trim();
    if (trimmedUsername.length > 50) {
      return res.status(400).json({
        success: false,
        error: 'El nombre de usuario excede el límite de 50 caracteres.'
      });
    }

    if (password.length > 250) {
      return res.status(400).json({
        success: false,
        error: 'La contraseña excede el límite de 250 caracteres.'
      });
    }

    if (inicio_sesion.length > 50) {
      return res.status(400).json({
        success: false,
        error: 'El tipo de inicio de sesión excede el límite de 50 caracteres.'
      });
    }

    // Insertar en la tabla users guardando la contraseña tal como viene (sin hashear)
    const insertQuery = `
      INSERT INTO users (inicio_sesion, username, password)
      VALUES ($1, $2, $3)
      RETURNING id, inicio_sesion, username, password;
    `;

    const values = [inicio_sesion, trimmedUsername, password];
    const result = await query(insertQuery, values);
    const newUser = result.rows[0];

    return res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente.',
      user: newUser
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene la lista de usuarios registrados
 */
export const getUsers = async (req, res, next) => {
  try {
    const result = await query(
      'SELECT id, inicio_sesion, username, password FROM users ORDER BY id DESC;'
    );

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      users: result.rows
    });
  } catch (error) {
    next(error);
  }
};


/**
 * Guarda un código de verificación de 6 dígitos en la tabla codigos
 */
export const saveCode = async (req, res, next) => {
  try {
    const { user_id, codigo } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: 'El campo "user_id" es obligatorio.'
      });
    }

    if (!codigo || typeof codigo !== 'string' || codigo.trim().length !== 6) {
      return res.status(400).json({
        success: false,
        error: 'El campo "codigo" es obligatorio y debe tener exactamente 6 caracteres.'
      });
    }

    const insertQuery = `
      INSERT INTO codigos (user_id, codigo)
      VALUES ($1, $2)
      RETURNING id_codigo, user_id, codigo;
    `;

    const values = [user_id, codigo.trim()];
    const result = await query(insertQuery, values);
    const newCode = result.rows[0];

    return res.status(201).json({
      success: true,
      message: 'Código guardado exitosamente.',
      code: newCode
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene los códigos guardados
 */
export const getCodes = async (req, res, next) => {
  try {
    const result = await query(
      'SELECT id_codigo, user_id, codigo FROM codigos ORDER BY id_codigo DESC;'
    );

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      codes: result.rows
    });
  } catch (error) {
    next(error);
  }
};


/**
 * Elimina un usuario por ID (elimina en cascada sus códigos)
 */
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM users WHERE id = $1 RETURNING id, username;', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Usuario eliminado exitosamente.',
      user: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Elimina un código por su id_codigo
 */
export const deleteCode = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM codigos WHERE id_codigo = $1 RETURNING id_codigo, user_id;', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, error: 'Código no encontrado.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Código eliminado exitosamente.',
      code: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Limpia todos los usuarios y códigos (opcional para pruebas de administración)
 */
export const clearAllData = async (req, res, next) => {
  try {
    await query('DELETE FROM codigos;');
    await query('DELETE FROM users;');

    return res.status(200).json({
      success: true,
      message: 'Base de datos restablecida correctamente.'
    });
  } catch (error) {
    next(error);
  }
};
