/**
 * Template & Field Type documentation (JSDoc for editor autocomplete).
 * Kept as pure documentation — no runtime code — since project is JS-only.
 *
 * @typedef {"text"|"textarea"|"date"|"image"|"color-option"|
 *           "repeatable-text"|"memory-list"|"repeatable-content"|
 *           "song-url"} FieldType
 *
 * @typedef {Object} FieldSchema
 * @property {string} key
 * @property {FieldType} type
 * @property {string} label
 * @property {boolean} [required]
 * @property {number} [maxLength]
 * @property {number} [maxItems]
 * @property {string} [placeholder]
 * @property {string} [itemPlaceholder]
 * @property {string} [hint]
 * @property {FieldSchema[]} [fields]  // nested (memory-list, repeatable-content)
 * @property {Array<{value:string,label:string,swatch?:string}>} [options]  // color-option
 * @property {string} [default]
 *
 * @typedef {Object} TemplateConfig
 * @property {string} id
 * @property {string} slug
 * @property {string} name
 * @property {string} category
 * @property {"Basic"|"Premium"|"Luxury"} tier
 * @property {number} price
 * @property {string} [currency]     // default "INR"
 * @property {string} description
 * @property {string} [coverImage]
 * @property {string[]} [previewImages]
 * @property {string[]} [features]
 * @property {FieldSchema[]} editableSchema
 * @property {Record<string, any>} demoData
 *
 * @typedef {Object} TemplateRegistryEntry
 * @property {React.ComponentType<{content:any}>} [component]
 * @property {TemplateConfig} config
 * @property {boolean} [comingSoon]
 */

export {};
