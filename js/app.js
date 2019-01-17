$(document).foundation()

let dropdown = $('#dd-weapon');

dropdown.empty();

dropdown.append('<option selected="true" disabled>Choose Weapon</option>');
dropdown.prop('selectedIndex', 0);

const url = 'https://mossumossu.github.io/ALDamage/res/weapons.json';

// Populate dropdown with list of weapons
$.getJSON(url, function (data) {
  $.each(data, function (key, entry) {
    dropdown.append($('<option></option>').attr('value', entry.name).text(entry.name));
  })
});