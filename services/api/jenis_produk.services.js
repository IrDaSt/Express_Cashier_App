const idGeneratorUtils = require("../../utilities/id-generator.utils")
const mysqlconn = require("../../utilities/mysql.utils")

// Last Data Jenis Produk
const getLastData = async () => {
    const lastdata = await mysqlconn.query(
        "select * from jenis_produk order by id_jenis_produk desc",
    )
    return lastdata
}

// All Jenis Produk
const getAll = async () => {
    const rows = await mysqlconn.query(`select * from jenis_produk`)
    return rows
}

// Jenis Produk by ID
const getById = async (id_jenis_produk) => {
    const rows = await mysqlconn.query(
        "Select * from jenis_produk where id_jenis_produk=?",
        [id_jenis_produk],
    )
    return rows
}

// Create Jenis Produk
const create = async ({
    id_jenis_produk = "JNP0000001",
    id_produk = "",
    nama_jenis_produk,
    jumlah_produk,
    harga_produk,
}) => {
    const create_jenis_produk = await mysqlconn.query(
        "insert into jenis_produk(id_jenis_produk, id_produk, nama_jenis_produk, jumlah_produk, harga_produk) values (?,?,?,?,?)",
        [
            id_jenis_produk,
            id_produk,
            nama_jenis_produk,
            jumlah_produk,
            harga_produk,
        ],
    )
    return {
        result: create_jenis_produk,
        id_jenis_produk,
    }
}

// update Jenis Produk
const update = async ({
    id_jenis_produk,
    nama_jenis_produk,
    jumlah_produk,
    harga_produk,
}) => {
    const result = await mysqlconn.query(
        "update jenis_produk set nama_jenis_produk=?, jumlah_produk=?, harga_produk=? where id_jenis_produk=?",
        [nama_jenis_produk, jumlah_produk, harga_produk, id_jenis_produk],
    )
    return result
}

// remove Jenis Produk
const remove = async (id_jenis_produk) => {
    const result = await mysqlconn.query(
        "delete from jenis_produk where id_jenis_produk=?",
        [id_jenis_produk],
    )
    return result
}

const getDataByIdproduk = async (id_produk) => {
    const result = await mysqlconn.query(
        "select * from jenis_produk inner join produk on produk.id_produk=jenis_produk.id_produk where jenis_produk.id_produk=?",
        [id_produk],
    )
    return result
}

const jenis_produk_ServicesApi = {
    getAll,
    getById,
    create,
    update,
    remove,
    getLastData,
    getDataByIdproduk,
}

module.exports = jenis_produk_ServicesApi
