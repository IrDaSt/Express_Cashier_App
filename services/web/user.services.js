const mysqlconn = require("../../utilities/mysql.utils");

const getAllUsers = async () => {
  const rowsUsers = await mysqlconn.query("select * from user");
  return rowsUsers;
};

const userServices = {
  getAllUsers,
};

module.exports = userServices;
