const sequelize = require('./database.js')
const { DataTypes } = require('sequelize')

const Notice = sequelize.define(
    "notice",
    {
        content:{
            type: DataTypes.TEXT,
            allowNull: true,
        },
        ctime:{
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        createdAt: false,
        updatedAt: false,
        paranoid: false,
    }
)

module.exports = Notice;