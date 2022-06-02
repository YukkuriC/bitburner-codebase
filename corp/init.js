// automated first steps of corp expansion

import { Divisions, Cities, SellMaterials } from '/corp/helper'

function bootDivision(C, division) {
    try { C.expandIndustry(division, division) } catch (e) { }

    // warehouse
    const divisionData = C.getDivision(division)
    for (var city of Cities) {
        try { C.expandCity(division, city) } catch (e) { }
        try { C.purchaseWarehouse(division, city) } catch (e) { }
    }

    // office
    for (var city of divisionData.cities) {
        // TODO1
    }

}

function setSupply(C, division) {
    const divisionData = C.getDivision(division)
    for (var city of divisionData.cities) {
        C.setSmartSupply(division, city, true)
        for (var prod of SellMaterials[division])
            C.sellMaterial(division, city, prod, 'MAX', 'MP')
    }
}

export async function main(ns) {
    const C = ns['corporation']
    const target = Divisions[ns.args[0] || 0]
    var corpInfo = C.getCorporation()

    bootDivision(C, target)

    // set supply
    try { C.unlockUpgrade('Smart Supply') } catch (e) { }
    setSupply(C, target)
}