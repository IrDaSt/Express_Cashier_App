const idGeneratorUtils = require("../../utilities/id-generator.utils");
const mysqlconn = require("../../utilities/mysql.utils");

// all books
const getAll = async () => {
    const rows = await mysqlconn.query(`select * from produk`);
    return rows;
};

// book by id
const getById = async (id_produk) => {
    const rows = await mysqlconn.query("Select * from produk where id_produk=?", [
        id_produk,
    ]);
    return rows;
};

// create book
const create = async ({ nama_produk, id_kategori }) => {
    const result = await mysqlconn.query(
        "insert into produk(id_produk, nama_produk, id_kategori) values (?,?,?)",
        [idGeneratorUtils.generateUUIDV4(), nama_produk, id_kategori]
    );
    return result;
};

// update book
const update = async ({ id_book, name, author, year, description }) => {
    const result = await mysqlconn.query(
        "update books set name=?, author=?, year=?, description=? where id_book=?",
        [name, author, year, description, id_book]
    );
    return result;
};

// remove book
const remove = async (id_produk) => {
    const result = await mysqlconn.query("delete from books where id_produk=?", [
        id_produk,
    ]);
    return result;
};

const booksServicesApi = {
    getAll,
    getById,
    create,
    update,
    remove,
};

module.exports = booksServicesApi;
