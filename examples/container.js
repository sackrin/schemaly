import { Schema, Fields, Field, CONTAINER, STRING, Collision } from 'schemaly';

const profile = Schema({
    machine: "profile",
    scope: ["r", "w"],
    roles: ["guest", "user"],
    blueprints: Fields([
        Field({
            machine: 'name',
            label: 'Name',
            // CONTAINER context allows for child blueprints
            context: CONTAINER,
            // You can now add a blueprints property
            // All blueprints must be wrapped in a Blueprints class
            // In this case we are using the bundled Fields class
            blueprints: Fields([
                // Add your child fields
                // There is no limit to nesting so can add more container and collection fields
                Field({
                    machine: 'title',
                    label: 'Title',
                    context: STRING
                }),
                Field({
                    machine: 'first_name',
                    label: 'First Name',
                    context: STRING
                }),
                Field({
                    machine: 'surname',
                    label: 'Surname',
                    context: STRING
                })
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
        // Name data can now be passed inside a name property
        name: {
            title: 'Mr',
            first_name: 'Johnny',
            surname: 'Smith'
        }
    })
    .collide()
    .then(collider.dump)
    .then(values => {
        // Returns { name: { title: 'Mr', first_name: 'Johnny', surname: 'Smith' } }
        console.log(values);
    });
