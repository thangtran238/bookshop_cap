using my.bookshop as my from '../db/schema';

service UserService @(path: '/users') {

    entity Users as projection on my.Users;
}
