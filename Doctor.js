document.addEventListener('DOMContentLoaded', function () {
    const availabilityDiv = document.getElementById('availability');

    if (!availabilityDiv) {
        console.error("Elemento 'availability' no encontrado");
        return;
    }

    // Función para generar intervalos de 40 minutos correctamente
    function generateTimeSlots(startHour, endHour) {
        let slots = [];
        let hour = startHour;
        let minute = 0;

        while (hour < endHour || (hour === endHour && minute === 0)) {
            let time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            slots.push(time);
        
            // Sumar 40 minutos
            minute += 40;
            if (minute >= 60) {
                minute -= 60; // Ajustar los minutos correctamente
                hour++; // Avanzar la hora
            }
        }
        return slots;
    }

    // Días y horarios de lunes a viernes (7 AM - 6 PM) y sábado (7 AM - 2 PM)
    const schedule = {
        "Lunes": generateTimeSlots(7, 18),
        "Martes": generateTimeSlots(7, 18),
        "Miércoles": generateTimeSlots(7, 18),
        "Jueves": generateTimeSlots(7, 18),
        "Viernes": generateTimeSlots(7, 18),
        "Sábado": generateTimeSlots(7, 14)
    };

    // Crear checkboxes dinámicamente
    Object.keys(schedule).forEach(day => {
        let dayLabel = document.createElement('h4');
        dayLabel.textContent = day;
        availabilityDiv.appendChild(dayLabel);

        schedule[day].forEach(time => {
            let label = document.createElement('label');
            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = 'availability';
            checkbox.value = `${day} ${time}`;

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(` ${time}`));
            availabilityDiv.appendChild(label);
            availabilityDiv.appendChild(document.createElement('br'));
        });
    });
});

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

    // Obtener horarios seleccionados
    let selectedTimes = [];
    document.querySelectorAll('input[name="availability"]:checked').forEach(checkbox => {
        selectedTimes.push(checkbox.value);
    });

    if (selectedTimes.length === 0) {
        alert("Por favor, selecciona al menos un horario disponible.");
        return;
    }

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
        availability: selectedTimes
    };

    // Enviar los datos usando Fetch API
    fetch('https://doctorsbackend-z586.onrender.com/practitioner', {
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
