var debug = require('debug')('riqra-service-partner:utils-validator')
const Joi = require('joi')

// Validate uri param
export const validateParam = (schema) => {
  return (req, res, next) => {
    const result = Joi.validate(req.params, schema)
    if (result.error) {
      return res['400']({success: false, validator: result.error}, 'Los campos nos son validos')
    }

    if (!req.value) {
      req.value = {}
    }

    if (!req.value['params']) {
      req.value['params'] = {}
    }

    req.params = result.value
    next()
  }
}

// Validate body attributes
export const validateBody = (schemas) => {
  return (req, res, next) => {
    const result = Joi.validate(req.body, schemas)
    if (result.error) {
      return res['400']({success: false, validator: result.error}, 'Los campos nos son validos')
    }

    if (!req.value) {
      req.value = {}
    }

    if (!req.value['body']) {
      req.value['body'] = {}
    }

    req.body = result.value
    next()
  }
}

// schemas
export const schemas = {
  partnerIDSchema: Joi.object().keys({
    id: Joi.number().required()
  }),
  adsIDSchema: Joi.object().keys({
    id: Joi.number().required(),
    partnerId: Joi.number().required()
  }),
  partIDSchema: Joi.object().keys({
    partnerId: Joi.number().required()
  }),
  partnerSlugifySchema: Joi.object().keys({
    partnerSlugify: Joi.string().required()
  }),
  partnerSchema: Joi.object().keys({
    name: Joi.string().required(),
    name_slugify: Joi.string().required(),
    logo: Joi.string().required(),
    background_color: Joi.string(),
    product_add_button_color: Joi.string(),
    cart_button_color: Joi.string(),
    product_info_color: Joi.string(),
    product_arrows_color: Joi.string(),
    minimum_purchase: Joi.string(),
    delivery_message: Joi.string(),
    is_featured: Joi.boolean().strict(),
    is_guest_enabled_to_buy: Joi.boolean().strict()
  }),
  partnerOptionalSchema: Joi.object().keys({
    name: Joi.string(),
    name_slugify: Joi.string(),
    logo: Joi.string(),
    background_color: Joi.string(),
    product_add_button_color: Joi.string(),
    cart_button_color: Joi.string(),
    product_info_color: Joi.string(),
    product_arrows_color: Joi.string(),
    minimum_purchase: Joi.string(),
    delivery_message: Joi.string(),
    is_featured: Joi.boolean().strict(),
    is_guest_enabled_to_buy: Joi.boolean().strict()
  }),
  adsSchema: Joi.object().keys({
    name: Joi.string().required(),
    photo: Joi.string().required(),
    link: Joi.string().required()
  }),
  adsUpdatedSchema: Joi.object().keys({
    name: Joi.string().required(),
    photo: Joi.string().required(),
    link: Joi.string().required()
  }),
  adsOptionalSchema: Joi.object().keys({
    name: Joi.string(),
    photo: Joi.string(),
    link: Joi.string()
  })
}
