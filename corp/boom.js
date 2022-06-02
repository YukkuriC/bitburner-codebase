// corporation hack
// TODO: upgrades & products hack

import { player } from 'meta/META'

const JOBS = ["Operations", "Engineer", "Business", "Management", "Research & Development", "Training",]
const OFFICE_SIZE = 500
const OFFICE_TOTAL = OFFICE_SIZE * JOBS.length
const WAREHOUSE_SIZE = 1000

export async function main(ns) {
    var corp = player['corporation']

    // unlocks
    corp.unlockUpgrades = [1, 1, 1, 1, 1, 1, 1, 1, 1]

    // upgrades

    for (var div of corp.divisions) {
        // office
        for (var off of Object.values(div.offices)) {
            if (!off.size) continue
            off.size = Math.max(off.size, OFFICE_TOTAL)

            while (off.employees.length < off.size)
                off.hireRandomEmployee()

            JOBS.forEach(j => off.setEmployeeToJob(j, OFFICE_SIZE))
        }
        //warehouse
        for (var wh of Object.values(div.warehouses)) {
            if (!wh.size) continue

            wh.level = 114514
            wh.updateSize(corp, div)
            wh.materials.RealEstate.qty = 1145141919
        }
    }
}