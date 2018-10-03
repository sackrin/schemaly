import { Schema, Fields, Field, STRING, Collision, GrantOne, DenyPolicy, AllowPolicy } from 'schemaly';

const profile = Schema({
    machine: "profile",
    scope: ["r", "w"],
    roles: ["guest", "user"],
    blueprints: Fields([
        Field({
            machine: 'first_name',
            label: 'First Name',
            // Typically you only need one to grant
            // You can use GrantAll to enforce all policies grant
            policies: GrantOne([
                // Deny all roles and scope by default
                // This ensures that only the rules below can grant
                DenyPolicy({ roles: ["*"], scope: ["*"]}),
                // We want both guest and user to be able to "r" this field
                AllowPolicy({ roles: ["guest", "user"], scope: ["r"] }),
                // We want only the user to be able to "w" this field
                AllowPolicy({ roles: ["user"], scope: ["w"] })
            ]),
            context: STRING
        })
    ])
});

const reactor = Collision({
    model: profile,
    // Change depending on your user's scope
    // You can specify one or multiple possible scopes
    scope: ["w"],
    // Change depending on your user's role
    // You can specify one or multiple possible roles
    roles: ["guest"]
});

reactor
    .with({
        first_name: "Johnny"
    })
    .collide()
    .then(reactor.dump)
    .then(values => {
        // Returns { first_name: 'Johnny' } with reactor scope "r"
        // Returns { } with reactor scope "w"
        console.log(values);
    });
