import { Schema, Fields, Field, STRING, Collision, SanitizeAll, SimpleSanitizer } from 'fissionjs';

const profile = Schema({
    machine: "profile",
    scope: ["r", "w"],
    roles: ["guest", "user"],
    blueprints: Fields([
        Field({
            machine: 'first_name',
            label: 'First Name',
            context: STRING,
            // You can add sanitizers using the SanitizeAll class
            // Sanitizers should be run after hydration
            // If you want to just format the output and not effect the value you should use getters
            // You can stack sanitizers to apply sanitizing layers
            // Sanitizers can be async so you can sanitize against api endpoints if you like
            sanitizers: SanitizeAll([
                // A simple sanitizer is bundled with fissionjs
                // It allows your to do basic sanitization
                // It is probably a good idea to create your own
                SimpleSanitizer({ filters: ['trim|upper_case'] })
            ])
        })
    ])
});

const collider = Collision({
    model: profile,
    scope: ["r"],
    roles: ["guest"]
});

collider
    .with({
        // Add some spaces and make lowercase
        first_name: "johnny  "
    })
    .collide()
    // Sanitize the data after hydration
    .then(collider.sanitize)
    .then(collider.dump)
    .then(values => {
        // Removed spaces and converts to uppercase
        // Returns { first_name: 'JOHHNY' }
        console.log(values);
    });
