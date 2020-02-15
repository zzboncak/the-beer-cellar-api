function makeUsersArray() {
    return [
        {
            id: 1,
            username: 'test-user-1',
            user_password: 'password1',
        },
        {
            id: 2,
            username: 'test-user-2',
            user_password: 'password2',
        },
        {
            id: 3,
            username: 'test-user-3',
            user_password: 'password3',
        },
        {
            id: 4,
            username: 'test-user-4',
            user_password: 'password4',
        },
    ]
}

function cleanTables(db) {
    return db.raw(
      `TRUNCATE
        beers,
        users
        RESTART IDENTITY CASCADE`
    )
}

function seedBeersTable(db, beers) {
    return db
        .into('beers')
        .insert(beers)
}

function seedUsersTable(db, users) {
    return db
        .into('users')
        .insert(users)
}

module.exports = {
    makeUsersArray,
    cleanTables,
    seedBeersTable,
    seedUsersTable
}