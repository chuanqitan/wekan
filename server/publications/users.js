Meteor.methods({
    ldapLoginOrCreate: function (email) {
        check(email, String);
        var union_pwd = 'unionpassword123';

        var info_api_url = 'http://info.tdrhedu.com/api/employee/' + email + '/';
        console.log(info_api_url);
        var result = Meteor.http.call('get', info_api_url);
        console.log(result);

        if (result && result.data.code === 0) {
            // has user
            var u = Meteor.users.findOne({'emails.address': email});
            console.log(u);

            var uid;
            if (!u) {
                // create user
                uid = Accounts.createUser({
                                username: result.data.result.cn_name,
                                email: email,
                                password: union_pwd,
                                profile: {language: 'zh-CN'}
                });
            } else {
                uid = u._id;
            }
            console.log('UID: ' + uid);

            if (uid) {
                console.log(email + ' has foud, try to reset password');
                Accounts.setPassword(uid, union_pwd);
            }
        }
    },

    hexDecode: function(token) {
        check(token, String);
        return new Buffer(token, 'hex').toString().split('$')[1];
    }
});
