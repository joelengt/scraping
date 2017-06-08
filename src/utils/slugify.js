export const slugify = (text) => {
  let keys = {
    'á': 'a',
    'é': 'e',
    'í': 'i',
    'ó': 'o',
    'ú': 'u',
    'ñ': 'n',
    'ä': 'a',
    'ë': 'e',
    'ï': 'i',
    'ö': 'o',
    'ü': 'u'
  }

  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[áéíóúñäëïöü]+/g, (value) => keys[value]) // Replace ñ with - n
    .replace(/[^\w-]+/g, '')       // Remove all non-word chars
    .replace(/--+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '')            // Trim - from end of text
}
