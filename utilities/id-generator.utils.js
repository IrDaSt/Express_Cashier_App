const uuid = require("uuid");

const generateUUIDV4 = () => uuid.v4();

const nextId = ({ id_lama, prefix_length }) => {
  const prefix = id_lama.substring(0, Number(prefix_length));
  const angka_str = id_lama.substring(Number(prefix_length), id_lama.length);
  const angka_num = Number(angka_str);
  const angka_plus_str = (angka_num + 1)
    .toString()
    .padStart(angka_str.length, "0");
  const id_baru = prefix + angka_plus_str;
  return id_baru;
};

const idGeneratorUtils = {
  generateUUIDV4,
  nextId,
};

module.exports = idGeneratorUtils;
