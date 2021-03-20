//博主
let sequelize = require('./database')
const { DataTypes } = require('sequelize')
function reg(i){
    return i = i < 10 ? '0' + i : i;
}

const Blogger = sequelize.define(
    "Blogger",
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        health:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        fans:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        loginId:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        loginPwd:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        ctime:{
            type: DataTypes.DATE,
            allowNull: false,
            get(){
                const time = this.getDataValue("ctime");
                if(time){
                    return `${time.getFullYear()}-${reg(time.getMonth()+1)}-${reg(time.getDate())}`
                }
                else return undefined;
            }
        },
        status:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        defense:{
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        createdAt: false,
        updatedAt: false,
        paranoid: false,
    }
)

module.exports = Blogger;