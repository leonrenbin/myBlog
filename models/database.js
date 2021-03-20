const { Sequelize } = require('sequelize')
//创建一个orm实例
const sequelize = new Sequelize('myblog','root','74185639',{
    host: 'localhost',
    dialect: 'mysql',
    logging: null,
})


module.exports = sequelize;