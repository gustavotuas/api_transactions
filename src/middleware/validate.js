const validate = (schema) => async (req, res, next) => {
  try {
    // valida el body contra el schema
    req.body = await schema.validate(req.body, {
      abortEarly: false, // muestra todos los errores, no solo el primero
      stripUnknown: true, // elimina campos no definidos en el schema
    });
    next();
  } catch (err) {
    return res.status(400).json({
      success: false,
      errors: err.errors,
    });
  }
};

module.exports = validate;
