using my.bookshop as stats from '../db/schema';

service Stats @(path: '/stats') {

    @readonly
    entity OrderInfo as
        projection on stats.Orders
        excluding {
            createdAt,
            createdBy,
            modifiedAt,
            modifiedBy,
            books
        }

}
