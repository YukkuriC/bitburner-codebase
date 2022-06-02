// helper functions for corporation

export const Divisions = ['Agriculture', 'Tobacco']
export const SellMaterials = {
    Agriculture: ['Food', 'Plants']
}
export const Cities = [
    'Sector-12', 'Aevum', 'Volhaven',
    'Chongqing', 'New Tokyo', 'Ishima'
]

export function tryUnlockUpgrade(api, upgrade) {
    try {
        api.unlockUpgrade(upgrade)
        return true
    } catch (e) {
        return false
    }
}