let contacts = [
    { firstName: 'Anton', lastName: 'Adler', email: 'anton@gmc.com', initials: 'AA' },
    { firstName: 'Berta', lastName: 'Baumann', email: 'berta@gmc.com', initials: 'BB' },
    { firstName: 'Cäsar', lastName: 'Cramer', email: 'caesar@gmc.com', initials: 'CC' },
    { firstName: 'Dora', lastName: 'Dürr', email: 'dora@gmc.com', initials: 'DD' },
    { firstName: 'Emil', lastName: 'Eckert', email: 'emil@gmc.com', initials: 'EE' },
    { firstName: 'Friedrich', lastName: 'Fischer', email: 'friedrich@gmc.com', initials: 'FF' },
    { firstName: 'Gustav', lastName: 'Gärtner', email: 'gustav@gmc.com', initials: 'GG' },
    { firstName: 'Heinrich', lastName: 'Hoffmann', email: 'heinrich@gmc.com', initials: 'HH' },
    { firstName: 'Ida', lastName: 'Illner', email: 'ida@gmc.com', initials: 'II' },
    { firstName: 'Julius', lastName: 'Jäger', email: 'julius@gmc.com', initials: 'JJ' }
];
let alphabetSections = [];

function renderContacts() {
    let contactSection = document.getElementById('contactSection');
    let currentLetter = '';

    contacts.forEach(contact => {
        let firstLetter = contact.lastName.charAt(0).toUpperCase();
        if (firstLetter !== currentLetter) {
            currentLetter = firstLetter;
            alphabetSections.push(`
                <div class="alphabet-container">
                    <span>${currentLetter}</span>
                </div>
            `);
        }
        alphabetSections.push(`
            <div class="separator"></div>
            <div class="contact-item">
                <div class="initials-container">${contact.initials}</div>
                <div class="contact-info-item">
                    <div class="contact-info">
                        <div class="contact-names">${contact.firstName} ${contact.lastName}</div>
                        <div class="contact-email">${contact.email}</div>
                    </div>
                </div>
                
            </div>
        `);
    });

    contactSection.innerHTML = `
        <button onclick="addNewContact()" class="add-contact-button">
            <span class="button-text">Add a new contact</span>
            <img src="/img/person_add.png" alt="Add Icon" class="button-icon">
        </button>
        <div class="contact-list-container">
            ${alphabetSections.join('')}
        </div>

    `;
}

function addNewContact() {
    alert("Neuen Kontakt hinzufügen");
}
