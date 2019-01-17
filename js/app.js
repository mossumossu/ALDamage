let dropdown = $('#dd-weapon');

dropdown.empty();

dropdown.append('<option selected="true" disabled>Choose Weapon</option>');
dropdown.prop('selectedIndex', 0);

const url = 'https://mossumossu.github.io/ALDamage/res/weapons.json';

// Populate dropdown with list of weapons
$.getJSON(url, function (data) {
  $.each(data, function (key, entry) {
    dropdown.append($('<option></option>').attr('value', entry.Name).text(entry.Name));
  })
});

$(".dd-weapon").change(function () {
    var currentWeapon = $('#dd-weapon').val();
    var currentLevel = $('#dd-weaponLevel').val();
    var cRoF, cDPShot;

    $.getJSON(url, function (data){
        $.each(data, function(key, entry){
            if(this.Name = currentWeapon){
                if(currentLevel == 0){
                    cDPShot = this.L0Damage;
                    cRoF = this.L0RoF;
                } 
                else if(currentLevel == 10){
                    cDPShot = this.L10Damage;
                    cRoF = this.L10RoF;
                }
                document.getElementById('Shots').innerHTML = this.Shots;
                
                document.getElementById('DPShot').innerHTML = cDPShot;
                document.getElementById('RoF').innerHTML = cRoF;
                document.getElementById('DPS').innerHTML = cDPShot * this.Shots * cRoF;
            }
        })
    })
});



$(document).foundation()