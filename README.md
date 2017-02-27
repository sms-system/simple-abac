# simple-abac

Simple Attribute-based access control module

## Example

File `config/abac.js`:

```js
var ABAC = require('simple-abac')

const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  MANAGER: 'MANAGER'
}

module.exports = new ABAC({
  '*': user => user.role == ROLES.ADMIN,
  create_post: () => true,
  edit_post: [
    (user, post) => user.role == ROLES.USER && post.user_id == user.id,
    (user, post) => user.role == ROLES.MANAGER,
  ],
  delete_post: { as: 'edit_post' }
})
```

File `app.js`:

```js
var abac = require('./conf/abac')

const adminUser = {
  id: 1,
  role: 'ADMIN'
}
const user = {
  id: 2,
  role: 'USER'
}
const posts = [{
  user_id: 2,
  title: 'Post from user 2'
}, {
  user_id: 3,
  title: 'Post from user 3'
}]

console.log('user #1 role: ' + adminUser.role)
posts.forEach(post => {
  if (abac.can( adminUser, 'delete_post', post )) {
    console.log('You can delete post "' + post.title + '"')
  } else {
    console.log('You can\'t delete post "' + post.title + '"')
  }
})
console.log('\n')

console.log('user #2 role: ' + user.role)
posts.forEach(post => {
  if (abac.can( user, 'delete_post', post )) {
    console.log('You can delete post "' + post.title + '"')
  } else {
    console.log('You can\'t delete post "' + post.title + '"')
  }
})
console.log('\n')
```

Result `node app.js` :
```
user #1 role: ADMIN
You can delete post "Post from user 2"
You can delete post "Post from user 3"


user #2 role: USER
You can delete post "Post from user 2"
You can't delete post "Post from user 3"

```