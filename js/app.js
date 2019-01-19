var armorData = [];
var weaponData = [];

var purplePlates = [1, 3, 5, 8, 11, 14, 18, 22, 26, 30];
var goldPlates = [2, 5, 8, 12, 16, 21, 27, 33, 39, 45];
var legendPlates = [3, 9, 15, 24, 33, 42, 54, 66, 78, 90];

var absoluteCD = {DD:0.26, CL:0.28, CA:0.30};

// populate dropdowns
let ddWeapon = $('#dd-weapon');
ddWeapon.empty();
ddWeapon.append('<option selected="true" disabled>Choose Weapon</option>');
ddWeapon.prop('selectedIndex', 0);

let ddWeaponLevel = $('#dd-weaponLevel');
ddWeaponLevel.empty();
for(i=0; i < 11; i++){
    ddWeaponLevel.append('<option value:' + i + '>' + i + '</option>')
}
ddWeaponLevel.prop('selectedIndex', 0);

// get armor damage multipliers
$.getJSON('https://mossumossu.github.io/ALDamage/res/armorMultipliers.json', function(data){
    armorData = data;
});

// get weapon data
function getWeaponData(){
    return $.getJSON('https://mossumossu.github.io/ALDamage/res/weapons.json', function(data){
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

var inputWeapon;
var currentWeapon;
var cArmor;
var cArmorMod;
var cArmorModData;
var cWeaponType;
var cWeaponAmmo;
var cWeaponRarity;
var cWeaponShots;
var cWeaponVolley;
var cWeaponAbsoluteCD;
var cWeaponCoef;

// on weapon change
$("#dd-weapon").change(function () {
    // read input weapon
    inputWeapon = $('#dd-weapon').val();

    // load weapon info from weaponData
    currentWeapon = weaponData[inputWeapon];

    // populate variables   
    cWeaponType = currentWeapon.WeaponType;
    cWeaponAmmo = currentWeapon.AmmoType;
    cWeaponRarity = currentWeapon.Rarity;
    cWeaponShots = currentWeapon.Shots;
    cWeaponVolley = currentWeapon.VolleyTime;
    cWeaponAbsoluteCD = absoluteCD[cWeaponType];
    cWeaponCoef = currentWeapon.Modifier;

    updateArmor();

    // update display
    document.getElementById('weaponType').innerHTML = cWeaponType;              
    document.getElementById('ammoType').innerHTML = cWeaponAmmo;
    document.getElementById('rarity').innerHTML = cWeaponRarity;
    document.getElementById('shots').innerHTML = cWeaponShots;
    document.getElementById('volleyTime').innerHTML = cWeaponVolley;
    document.getElementById('absoluteCD').innerHTML = cWeaponAbsoluteCD;
    document.getElementById('wCoef').innerHTML = cWeaponCoef;
});

// on target armor change
$("#dd-targetArmor").change(function () {
    updateArmor();
});

// on input
$(".input").change(function () {

    // read input values
    var currentLevel = parseInt($('#dd-weaponLevel').val());
    var currentFP = parseInt($('#txt-FP').val());
    var currentEff = (parseInt($('#txt-Eff').val()))/100;
    var cReload = parseInt($('#txt-Reload').val());

    // initialize some other variables
    var nextLevel = currentLevel + 1;
    var cRoF, cBaseDPShot, cFDPShot, cDPS, uRoF, uBaseDPShot, uFDPShot, uDPS;
    var plates = [];

    // check weapon rarity and populate plates array appropriately
    if(cWeaponRarity == "Purple"){
        plates = purplePlates;
    }
    else if (cWeaponRarity == "Gold"){
        plates = goldPlates;
    }
    else if (cWeaponRarity == "Legendary"){
        plates = legendPlates;
    };

    // calculate base damage per shot
    cBaseDPShot = currentWeapon.L0Damage + ((currentWeapon.L10Damage - currentWeapon.L0Damage) / 10 ) * currentLevel;
    cBaseDPShot = Math.round(cBaseDPShot);

    // final damage per shot
    cFDPShot = cBaseDPShot * currentEff * ((100 + currentFP) / 100) * cWeaponCoef * cArmorMod;

    // rate of fire
    cRoF = currentWeapon.L0RoF + ((currentWeapon.L10RoF - currentWeapon.L0RoF) / 10 ) * currentLevel;
    cRoF = cRoF * Math.sqrt(200/(cReload + 100));
    
    // and damage per second
    cDPS = (cFDPShot * cWeaponShots) / (cRoF + cWeaponVolley + cWeaponAbsoluteCD);

    // update display             
    document.getElementById('DPShot').innerHTML = cBaseDPShot;
    document.getElementById('RoF').innerHTML = Number(cRoF).toFixed(2);
    document.getElementById('cFDPShot').innerHTML = Number(cFDPShot).toFixed(2);
    document.getElementById('DPS').innerHTML = Number(cDPS).toFixed(2);

    // if the weapon isn't max level, calculate and display info on next level
    if(currentLevel < 10) {

        // calculate base damage per shot
        uBaseDPShot = currentWeapon.L0Damage + ((currentWeapon.L10Damage - currentWeapon.L0Damage) / 10 ) * nextLevel;
        uBaseDPShot = Math.round(uBaseDPShot);
        
        // final damage per shot
        uFDPShot = uBaseDPShot * currentEff * ((100 + currentFP) / 100) * cWeaponCoef * cArmorMod;

        // rate of fire
        uRoF = currentWeapon.L0RoF + ((currentWeapon.L10RoF - currentWeapon.L0RoF) / 10 ) * nextLevel;
        uRoF = uRoF * Math.sqrt(200/(cReload + 100));

        // and damage per second
        uDPS = (uFDPShot * cWeaponShots) / (uRoF + cWeaponVolley + cWeaponAbsoluteCD);
        
        // update display
        document.getElementById('uDPShot').innerHTML = uBaseDPShot;
        document.getElementById('uRoF').innerHTML = Number(uRoF).toFixed(2);
        document.getElementById('uFDPShot').innerHTML = Number(uFDPShot).toFixed(2);
        document.getElementById('uDPS').innerHTML = Number(uDPS).toFixed(2);
        document.getElementById('Plates').innerHTML = plates[currentLevel];              
        document.getElementById('DPSPPlate').innerHTML = Number((uDPS - cDPS) / plates[currentLevel]).toFixed(2);
    }
    // if the weapon is max level
    else {            
        document.getElementById('uDPShot').innerHTML = "-";
        document.getElementById('uRoF').innerHTML = "-";
        document.getElementById('uFDPShot').innerHTML = "-";
        document.getElementById('uDPS').innerHTML = "-";    
        document.getElementById('Plates').innerHTML = "-";              
        document.getElementById('DPSPPlate').innerHTML = "-";
    } 
});

// when filter dropdown is changed
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

function updateArmor(){

    // get target armor type from dropdown
    cArmor = $('#dd-targetArmor').val().toLowerCase();

    // find armor modifier data for current weapon
    armorData.forEach(function(item){
        if(item.weaponType == cWeaponType && item.AmmoType == cWeaponAmmo){
            cArmorModData = item;
        };
    });
    
    // get armor multiplier for current target armor type
    if(cArmor == "neutral"){
        cArmorMod = 1;
    }
    else{
        cArmorMod = cArmorModData[cArmor];
    };

    // update display
    document.getElementById('aMult').innerHTML = cArmorMod;
}

$(document).foundation()