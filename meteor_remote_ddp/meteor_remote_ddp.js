if (Meteor.isClient) {
    Meteor.startup(function() {
        DDPConnection = DDP.connect('http://localhost:3000/');

        Meteor.connection = DDPConnection;
        Accounts.connection = Meteor.connection;
        Meteor.users = new Meteor.Collection('users', {
            connection: DDPConnection
        });
        Meteor.connection.subscribe('users');

        console.log(DDPConnection);


        //
        // autorun.startup._storedLoginToken
        //
        Tracker.autorun(function() {
            var token = Session.get('_storedLoginToken');
            if (token) {
                Meteor.loginWithToken(token, function(err) {
                    if (!err) console.log('loginWithToken ', token);
                    if (err) {
                        Session.set('ddpErrors', err);
                        //   Meteor.setTimeout(function () {
                        //       Session.set('ddpErrors', '');
                        //   }, 10000);
                    }
                });
            }
        });
        //
        // autorun.user
        //
        Tracker.autorun(function() {
            var user = Meteor.user();
            console.log('autorun.user');
            if (user) {
                // Session.setPersistent('_storedLoginToken', Accounts._storedLoginToken());
                Session.set('_storedLoginToken', Accounts._storedLoginToken());
            }
        });
    });
    // counter starts at 0
    Session.setDefault('counter', 0);

    Template.hello.helpers({
        counter: function() {
            return Session.get('counter');
        }
    });

    Template.hello.events({
        'click button': function() {
            // increment the counter when button is clicked
            Session.set('counter', Session.get('counter') + 1);
        },
        'click .login-button': function(e, t) {
            e.preventDefault();

            var email = t.find('.login-email').value,
                password = t.find('.login-password').value;

            Meteor.loginWithPassword(email, password, function(e) {
                if (e) {
                    console.log(e);
                    Session.set('ddpErrors', e);
                    // Meteor.setTimeout(function () {
                    //     Session.set('ddpErrors', '');
                    // }, 10000);
                }
                if (Meteor.user()) {
                    console.log(Meteor.user());
                }
                return;
            });

            return false;
        },
    });
}

if (Meteor.isServer) {
    Meteor.startup(function() {
        // code to run on server at startup
    });
}
