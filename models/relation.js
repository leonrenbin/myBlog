const Blog = require('./blog')
const Comments = require('./comments')
const EveryDay = require('./everyday')
const Mapping = require('./tag_blog_mapping')
const Tags = require('./tags')

Mapping.belongsTo(Blog)
Mapping.belongsTo(Tags)

Comments.belongsTo(Blog)

Blog.hasMany(Tags)