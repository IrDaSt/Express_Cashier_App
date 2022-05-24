const idGeneratorUtils = require("../../utilities/id-generator.utils");
const mysqlconn = require("../../utilities/mysql.utils");

// Last Data Kategori
const getLastData = async () => {
    const lastdata = await mysqlconn.query(
        "select * from kategori order by id_kategori desc"
    )
    return lastdata
}


// All Kategori
const getAll = async () => {
    const rows = await mysqlconn.query(`select * from kategori`);
    return rows;
};

const getAllbyUser = async (id_user) => {
    const rows = await mysqlconn.query("select * from kategori where id_user=?", [id_user]);
    return rows;
};

// Kategori by ID
const getById = async (id_kategori) => {
    const rows = await mysqlconn.query("Select * from kategori where id_kategori=?", [
        id_kategori,
    ]);
    return rows;
};

// Create Kategori
const create = async ({ id_kategori = 'KAT0000001', nama_kategori, id_user }) => {
    const newKategori = await mysqlconn.query(
        "insert into kategori(id_kategori, nama_kategori, id_user) values(?,?,?)",
        [id_kategori, nama_kategori, id_user]
    )
    return {
        result: newKategori,
        id_kategori,
        id_user
    }
}


// update Kategori
const update = async ({ nama_kategori, id_kategori }) => {
    const result = await mysqlconn.query(
        "update kategori set nama_kategori=? where id_kategori=?",
        [nama_kategori, id_kategori]
    );
    return result;
};

// remove Kategori
const remove = async (id_kategori) => {
    const result = await mysqlconn.query("delete from kategori where id_kategori=?", [
        id_kategori,
    ]);
    return result;
};

// Get ProduK Data From Kategori
const getProductByKategori = async (id_kategori) => {
    const result = await mysqlconn.query("select count(produk.nama_produk) as jumlah_produk from produk inner join kategori on produk.id_kategori = kategori.id_kategori where kategori.id_kategori = ?",
        [id_kategori],
    );
    return result;
}

const kategoriServicesApi = {
    getAll,
    getById,
    create,
    update,
    remove,
    getLastData,
    getProductByKategori,
    getAllbyUser
};


module.exports = kategoriServicesApi;