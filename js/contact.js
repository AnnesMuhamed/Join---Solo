let contacts = [
    { firstName: 'Anton', lastName: 'Adler', email: 'anton.adler@example.com', phone: '123-456-7890' },
    { firstName: 'Berta', lastName: 'Baumann', email: 'berta.baumann@example.com', phone: '123-456-7891' },
    { firstName: 'Cäsar', lastName: 'Cramer', email: 'caesar.cramer@example.com', phone: '123-456-7892' },
    { firstName: 'Dora', lastName: 'Dürr', email: 'dora.duerr@example.com', phone: '123-456-7893' },
    { firstName: 'Emil', lastName: 'Eckert', email: 'emil.eckert@example.com', phone: '123-456-7894' },
    { firstName: 'Friedrich', lastName: 'Fischer', email: 'friedrich.fischer@example.com', phone: '123-456-7895' },
    { firstName: 'Gustav', lastName: 'Gärtner', email: 'gustav.gaertner@example.com', phone: '123-456-7896' },
    { firstName: 'Heinrich', lastName: 'Hoffmann', email: 'heinrich.hoffmann@example.com', phone: '123-456-7897' },
    { firstName: 'Ida', lastName: 'Illner', email: 'ida.illner@example.com', phone: '123-456-7898' },
    { firstName: 'Julius', lastName: 'Jäger', email: 'julius.jaeger@example.com', phone: '123-456-7899' }
];

function renderContacts() {
    let contactSection = document.getElementById('contactSection');
    
    contactSection.innerHTML = `
        <button onclick="addNewContact()">Add a new Contact</button>
        <div class="contact-list-container">
            ${contacts.map(contact => `
                <div class="contact-item">
                    <div>${contact.firstName} ${contact.lastName}</div>
                    <div>${contact.email}</div>
                    <div>${contact.phone}</div>
                </div>
            `).join('')}
        </div>
    `;
}

function addNewContact() {
    // Logik zum Hinzufügen eines neuen Kontakts
    alert("Neuen Kontakt hinzufügen");
}
