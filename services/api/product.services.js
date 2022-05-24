const idGeneratorUtils = require("../../utilities/id-generator.utils");
const mysqlconn = require("../../utilities/mysql.utils");

// Last Data Kategori
const getLastData = async () => {
    const lastdata = await mysqlconn.query(
        "select * from jenis_produk order by id_jenis_produk desc"
    )
    return lastdata
}

const createKategori = async ({ id_kategori = 'KAT0000001', nama_kategori }) => {
    const newKategori = await mysqlconn.query(
        "insert into kategori(id_kategori, nama_kategori) values(?,?)",
        [id_kategori, nama_kategori]
    )
    return {
        result: newKategori,
        id_kategori
    }
}

// Test Gambar
const uploadgambar = async ({ link_foto_produk }) => {
    const result = await mysqlconn.query(
        "insert into gambarplease(link_foto_produk) values (?)",
        [link_foto_produk]
    );
    return result;
};

// all products
const getAll = async () => {
    const rows = await mysqlconn.query(`select * from produk`);
    return rows;
};

// product by id
const getById = async (id_produk) => {
    const rows = await mysqlconn.query("Select * from produk where id_produk=?", [
        id_produk,
    ]);
    return rows;
};

// product by id kategori
const getByKategoriId = async (id_kategori) => {
    const rows = await mysqlconn.query("Select * from produk where id_kategori=?", [
        id_kategori,
    ]);
    return rows;
};

// product by id user
const getByUserId = async (id_user) => {
    const rows = await mysqlconn.query("Select * from produk where id_user=?", [
        id_user,
    ]);
    return rows;
};

// create product
const create = async ({ id_produk = idGeneratorUtils.generateUUIDV4(), id_user, id_kategori = "", nama_produk, link_foto_produk = "" }) => {
    const result = await mysqlconn.query(
        "insert into produk(id_produk, id_user, id_kategori, nama_produk, link_foto_produk) values (?,?,?,?,?)",
        [id_produk, id_user, id_kategori, nama_produk, link_foto_produk]
    );
    return result;
};

// create jenis produk
const createjenisproduk = async ({ id_jenis_produk = "JNP0000001", id_produk = idGeneratorUtils.generateUUIDV4(),
    nama_jenis_produk, jumlah_produk, harga_produk }) => {
    const create_jenis_produk = await mysqlconn.query(
        "insert into jenis_produk(id_jenis_produk, id_produk, nama_jenis_produk, jumlah_produk, harga_produk) values (?,?,?,?,?)",
        [id_jenis_produk, id_produk, nama_jenis_produk, jumlah_produk, harga_produk]
    );
    return {
        result: create_jenis_produk,
        id_jenis_produk
    };
};


// update product
const update = async ({ id_produk, nama_produk, id_kategori }) => {
    const result = await mysqlconn.query(
        "update produk set nama_produk=?, id_kategori=? where id_produk=?",
        [nama_produk, id_kategori, id_produk]
    );
    return result;
};

// remove product
const remove = async (id_produk) => {
    const result = await mysqlconn.query("delete from produk where id_produk=?", [
        id_produk,
    ]);
    return result;
};

const productsServicesApi = {
    getAll,
    getById,
    create,
    update,
    remove,
    uploadgambar,
    createjenisproduk,
    getLastData,
    createKategori,
    getByKategoriId,
    getByUserId
};


module.exports = productsServicesApi;
