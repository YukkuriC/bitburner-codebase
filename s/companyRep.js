// auto increase HUGE reputation among companys with faction with EXPLOITS

import { main as rise } from '/meta/rise'
import { terminal } from '/meta/META'

// https://github.com/bitburner-official/bitburner-src/blob/dev/markdown/bitburner.companynameenumtype.md
const companys = {
    ECorp: 'ECorp',
    MegaCorp: 'MegaCorp',
    BachmanAndAssociates: 'Bachman & Associates',
    BladeIndustries: 'Blade Industries',
    NWO: 'NWO',
    ClarkeIncorporated: 'Clarke Incorporated',
    OmniTekIncorporated: 'OmniTek Incorporated',
    FourSigma: 'Four Sigma',
    KuaiGongInternational: 'KuaiGong International',
    FulcrumTechnologies: 'Fulcrum Technologies',
    StormTechnologies: 'Storm Technologies',
    DefComm: 'DefComm',
    HeliosLabs: 'Helios Labs',
    VitaLife: 'VitaLife',
    IcarusMicrosystems: 'Icarus Microsystems',
    UniversalEnergy: 'Universal Energy',
    GalacticCybersystems: 'Galactic Cybersystems',
    AeroCorp: 'AeroCorp',
    OmniaCybersystems: 'Omnia Cybersystems',
    SolarisSpaceSystems: 'Solaris Space Systems',
    DeltaOne: 'DeltaOne',
    GlobalPharmaceuticals: 'Global Pharmaceuticals',
    NovaMedical: 'Nova Medical',
    CIA: 'Central Intelligence Agency',
    NSA: 'National Security Agency',
    WatchdogSecurity: 'Watchdog Security',
    LexoCorp: 'LexoCorp',
    RhoConstruction: 'Rho Construction',
    AlphaEnterprises: 'Alpha Enterprises',
    Police: 'Aevum Police Headquarters',
    SysCoreSecurities: 'SysCore Securities',
    CompuTek: 'CompuTek',
    NetLinkTechnologies: 'NetLink Technologies',
    CarmichaelSecurity: 'Carmichael Security',
    FoodNStuff: 'FoodNStuff',
    JoesGuns: "Joe's Guns",
    OmegaSoftware: 'Omega Software',
    NoodleBar: 'Noodle Bar',
}
// https://github.com/bitburner-official/bitburner-src/blob/dev/markdown/bitburner.jobfieldenumtype.md
const works = {
    software: 'Software',
    softwareConsultant: 'Software Consultant',
    it: 'IT',
    securityEngineer: 'Security Engineer',
    networkEngineer: 'Network Engineer',
    business: 'Business',
    businessConsultant: 'Business Consultant',
    security: 'Security',
    agent: 'Agent',
    employee: 'Employee',
    partTimeEmployee: 'Part-time Employee',
    waiter: 'Waiter',
    partTimeWaiter: 'Part-time Waiter',
}
const repLim = 1e30

export async function main(ns) {
    for (var c of Object.values(companys)) {
        var oldRep = ns.singularity.getCompanyRep(c),
            newRep = oldRep
        if (oldRep > repLim) continue
        for (var w of Object.values(works)) {
            rise()
            let job = ns.singularity.applyToCompany(c, w)
            if (!job) {
                // console.log(`Failed to apply ${w} to ${c}`)
                continue
            }
            ns.singularity.workForCompany(c)
            await ns.sleep(100)
            ns.singularity.stopAction()
            newRep = ns.singularity.getCompanyRep(c)
            if (newRep > repLim) break
        }
        terminal.print(`Company ${c} increased ${newRep - oldRep}`)
    }
}
