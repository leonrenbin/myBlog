// require('./blog')
require('./comments')
// require('./blogger')
// require('./everyday')
// require('./tag_blog_mapping')
// require('./tags')
// require('./aboutme')
// require('./aboutBlog')
// require('./notice')

const sequelize = require('./database')
sequelize.sync({alert: true}).then(()=>{
    console.log('所有模型同步完成=================');
})