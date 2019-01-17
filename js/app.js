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

var normalPlates = [1, 3, 5, 8, 11, 14, 18, 22, 26, 30];

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
    var currentLevel = parseInt($('#dd-weaponLevel').val());
    var nextLevel = currentLevel + 1;
    var shots = weaponData[currentWeapon].Shots
    var cRoF, cDPShot, cDPS, uROF, uDPShot, uDPS;

    cDPShot = weaponData[currentWeapon].L0Damage + ((weaponData[currentWeapon].L10Damage - weaponData[currentWeapon].L0Damage) / 10 ) * currentLevel;
    cRoF = weaponData[currentWeapon].L0RoF + ((weaponData[currentWeapon].L10RoF - weaponData[currentWeapon].L0RoF) / 10 ) * currentLevel;
    cDPS = cDPShot * cRoF * shots;

    document.getElementById('Shots').innerHTML = weaponData[currentWeapon].Shots;              
    document.getElementById('DPShot').innerHTML = cDPShot;
    document.getElementById('RoF').innerHTML = cRoF;
    document.getElementById('DPS').innerHTML = cDPS;

    if(currentLevel < 10) {
        uDPShot = weaponData[currentWeapon].L0Damage + ((weaponData[currentWeapon].L10Damage - weaponData[currentWeapon].L0Damage) / 10 ) * nextLevel;
        uRoF = weaponData[currentWeapon].L0RoF + ((weaponData[currentWeapon].L10RoF - weaponData[currentWeapon].L0RoF) / 10 ) * nextLevel;
        uDPS = uDPShot * uRoF * shots;
        
        document.getElementById('uShots').innerHTML = weaponData[currentWeapon].Shots;              
        document.getElementById('uDPShot').innerHTML = uDPShot;
        document.getElementById('uRoF').innerHTML = uRoF;
        document.getElementById('uDPS').innerHTML = uDPS;

        document.getElementById('Plates').innerHTML = normalPlates[currentLevel];              
        document.getElementById('DPSPPlate').innerHTML = (uDPS - cDPS) / normalPlates[currentLevel];
    }
    else {
        document.getElementById('uShots').innerHTML = "-";              
        document.getElementById('uDPShot').innerHTML = "-";
        document.getElementById('uRoF').innerHTML = "-";
        document.getElementById('uDPS').innerHTML = "-";
    
        document.getElementById('Plates').innerHTML = "-";              
        document.getElementById('DPSPPlate').innerHTML = "-";
    } 
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
    document.getElementsByTagName("p").innerHTML = "-";
})

$(document).foundation()