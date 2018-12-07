const fetch = require("node-fetch");

module.exports = function(UserAccount) {
    
    return async function(info) {
        
        const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${info.options.captcha}`, {
            method: "POST"
        });
    
        const data = await response.json();
        
        if (!data.success) {
            let error = new Error("Recaptcha Failed");
            error.status = 403;
            throw error;
        }

        UserAccount.app.models.Email.send({
            to: info.email,
            from: "support@i4policy.org",
            subject: "Password reset request",
            html: `Please follow the following <a href="http://localhost:8080/app/#/reset?access_token=${info.accessToken.id}">Password Reset</a> link to reset your password`
        }, function(err) {
            if (err) throw err;
        });
    
    };

};