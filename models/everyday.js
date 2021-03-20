const sequelize = require('./database.js')
const { DataTypes } = require('sequelize')
function reg(i){
    return i = i < 10 ? '0' + i : i;
}

const Everyday = sequelize.define(
    "Everyday",
    {
        content:{
            type: DataTypes.TEXT,
            allowNull: false,
        },
        ctime:{
            type: DataTypes.DATE,
            allowNull: false,
            get(){
                const time = this.getDataValue("ctime");
                if(time){
                    return `${time.getFullYear()}-${reg(time.getMonth())}-${reg(time.getDate())}`
                }
                else return undefined;
            }
        },
    },
    {
        createdAt: false,
        updatedAt: false,
        paranoid: false,
    }
)

module.exports = Everyday;