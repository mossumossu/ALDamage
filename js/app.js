let ddWeapon = $('#dd-weapon');
ddWeapon.empty();
ddWeapon.append('<option selected="true" disabled>Choose Weapon</option>');
ddWeapon.prop('selectedIndex', 0);

let ddWeaponLevel = $('#dd-weaponLevel');
ddWeaponLevel.empty();
for(i=0; i < 11; i++){
    ddWeaponLevel.append('<option value:' + i + '>' + i + '</option>')
}

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
        ddWeapon.append(new Option(item.Name, index));
    });
});

getWeaponData();

$(".dd-weapon").change(function () {
    var currentWeapon = $('#dd-weapon').val();
    var currentLevel = $('#dd-weaponLevel').val();
    var cRoF, cDPShot, cDPS;

    cDPShot = weaponData[currentWeapon].L0Damage + ((weaponData[currentWeapon].L10Damage - weaponData[currentWeapon].L0Damage) / 10 ) * currentLevel;
    cRoF = weaponData[currentWeapon].L0RoF + ((weaponData[currentWeapon].L10RoF - weaponData[currentWeapon].L0RoF) / 10 ) * currentLevel;
    cDPS = cDPShot * cRoF * weaponData[currentWeapon].Shots;

    document.getElementById('Shots').innerHTML = weaponData[currentWeapon].Shots;              
    document.getElementById('DPShot').innerHTML = cDPShot;
    document.getElementById('RoF').innerHTML = cRoF;
    document.getElementById('DPS').innerHTML = cDPS;
});

$("#dd-classFilter").change(function (){
    ddWeapon.empty();
    ddWeapon.append('<option selected="true" disabled>Choose Weapon</option>');
    ddWeapon.prop('selectedIndex', 0);

    if($('#dd-classFilter').val() == "ALL"){
        weaponData.forEach(function(item, index) {
            ddWeapon.append(new Option(item.Name, index));
        });
    }
    else{
        weaponData.forEach(function(item, index) {
            if(item.WeaponType == $('#dd-classFilter').val())
                ddWeapon.append(new Option(item.Name, index));
        });
    };
    
    document.getElementById('Shots').innerHTML = "-";              
    document.getElementById('DPShot').innerHTML = "-";
    document.getElementById('RoF').innerHTML = "-";
    document.getElementById('DPS').innerHTML = "-";
})

$(document).foundation()