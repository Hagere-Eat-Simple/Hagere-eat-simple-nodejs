
const bcrypt = require('bcryptjs');

exports.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const encryptedPass = await bcrypt.hash(password, salt);
    return encryptedPass;
}

exports.matchPassword = async (password, savedPassword) => {
    try {
        return await bcrypt.compare(password, savedPassword);
    } 
	catch (e) {
        console.log(e);
    }
}