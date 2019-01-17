let dropdown = $('#dd-weapon');
dropdown.empty();
dropdown.append('<option selected="true" disabled>Choose Weapon</option>');
dropdown.prop('selectedIndex', 0);

const url = 'https://mossumossu.github.io/ALDamage/res/weapons.json';

var weaponData = [];

// populate weapon data array from .json
function getWeaponData(){
    return $.getJSON(url, function(data){
        weaponData = data;
    });
};

// populate weapon dropdown from array
getWeaponData().done(function(){
    weaponData.forEach(function(item, index) {
        dropdown.append(new Option(item.Name, index));
    });
});

getWeaponData();

$(".dd-weapon").change(function () {
    var currentWeapon = $('#dd-weapon').val();
    var currentLevel = $('#dd-weaponLevel').val();
    var cRoF, cDPShot;

    if(currentLevel == 0){
        cDPShot = weaponData[currentWeapon].L0Damage;
        cRoF = weaponData[currentWeapon].L0RoF;
    } 
    else if(currentLevel == 10){
        cDPShot = weaponData[currentWeapon].L10Damage;
        cRoF = weaponData[currentWeapon].L10RoF;
    }

    document.getElementById('Shots').innerHTML = weaponData[currentWeapon].Shots;              
    document.getElementById('DPShot').innerHTML = cDPShot;
    document.getElementById('RoF').innerHTML = cRoF;
    document.getElementById('DPS').innerHTML = cDPShot * weaponData[currentWeapon].Shots * cRoF;
});



$(document).foundation()