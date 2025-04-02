document.getElementById('doctorForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtener los valores del formulario
    const name = document.getElementById('name').value;
    const familyName = document.getElementById('familyName').value;
    const identifierSystem = document.getElementById('identifierSystem').value;
    const identifierValue = document.getElementById('identifierValue').value;
    const specialty = document.getElementById('specialty').value;
    const cellPhone = document.getElementById('cellPhone').value;
    const email = document.getElementById('email').value;
    const availability = document.getElementById('availability').value;

    // Crear el objeto Practitioner en formato FHIR
    const doctor = {
        resourceType: "Practitioner",
        name: [{
            use: "official",
            given: [name],
            family: familyName
        }],
        identifier: [{
            system: identifierSystem,
            value: identifierValue
        }],
        telecom: [{
            system: "phone",
            value: cellPhone,
            use: "work"
        }, {
            system: "email",
            value: email,
            use: "work"
        }],
        qualification: [{
            identifier: [{
                system: "http://registro-medico",
                value: identifierValue
            }],
            code: {
                text: specialty
            }
        }],
        availability: availability
    };

    // Enviar los datos usando Fetch API
    fetch('https://hl7-fhir-ehr-anam-0132-b.onrender.com/medico', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(doctor)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        alert('Médico registrado exitosamente!');
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Hubo un error al registrar el médico.');
    });
});
