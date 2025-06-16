// generate_hash.js
import bcrypt from 'bcrypt';

const plainPassword = 'adm*123';

bcrypt.hash(plainPassword, 10, (err, hash) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Use este HASH no seu INSERT SQL:', hash);
});