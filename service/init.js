const validate = require('validate.js')
const moment = require('moment')
validate.extend(validate.validators.datetime,{
    parse(value, options){
        let formats = ['YYYY-MM-DD', 'YYYY-M-D', 'x']//允许的时间格式,x是时间戳
        if(formats.dateOnly){
            formats = ['YYYY-MM-DD', 'YYYY-M-D', 'x']
        }
        return +moment.utc(value, formats, true);//true,是严格模式
    },
    format(value, options){
        let format = 'YYYY-MM-DD'
        if(!options.dateOnly){
            format += ' HH:mm:ss';
        }
        return moment.utc(value).format(format)
    }
})