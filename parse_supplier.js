import fs from 'fs';

const a = `1 Is there a procedure to measure competency of the supplier capabilities against needs/requirements? YES
2 Is there a procedure to measure the supplier's respond to the needs/demands, and to market and supply fluctuations? YES
3 Is the company willing to establish a Quality Agreement in accordance with your requirements? YES
4 Does thissupplier has control over their policies, processes, procedures, and supply chain? Does they ensure that they deliver consistently and reliably, especially if they rely on scarce resources, and if these resources are controlled? YES
5 Is there any information that the supplier can offer to demonstrate their ongoing financial strength? YES
6 Is there a potential for price reduction based on increased efficiencies? YES
7 Does thissupplier ensure that they consistently provide high quality goods or services? YES
8 Is there a quality culture in the organization driven and supported by top management? YES
9 Is there a written procedure to reduce their environmental footprint? Have they earned any green accolades or credentials? YES
10 Are there well defined functional contacts? Does the supplier communicate pro-actively? YES
11 Is the supplier providing goods/services to the company for long period of time and how long? YES
12 Whether there is any business contingency plan if the supplier due to itsfinacial incapacity or for force majure can not deliver the products? YES
13 Did the supplier deliver shipment in time during the last year? If no, howmany times did they fail? YES
14 Is the supplier prompt in replying to enquiries? YES
15 Does the supplier have a good market reputation? YES
16 Does the facility have sufficient financial capability to run bulk production as per order? PARTIAL
17 Is the company capable to meet the lead time both for samples and bulk production? YES
18 Does the supplier have adequate resources(i.e. Manpower, Machinaries Equipments etc.) to meet the customer's product requirement? YES
19 Does the supplier maintain a pricing that is consistent with the market price? YES
20 Has the vendor regularly met his commitment to high quality standards with respect to delivery & after salesservice? YES`;

const b = `1 Does the supplier prohibit Child labor? Is the proof of age for all Workers collected, documented and preserved? YES
2 Is there any prohibit forced, prison, bonded or involuntary labour? YES
3 Is there proactive measuresfor preventing any severe environmental pollution, which is to be understood as pollution that is likely to spread widely from the site and where the effects will be very difficult or expensive to correct? YES
4 Are the workers prevented from exposure to severe health or safety hazards, which are to be understood as health or safety hazards that are likely to pose an immediate risk of causing death or permanent injury? YES
5 Are all the workers paid a wage equal to or exceeding the legal minimum wage? YES
6 Does the supplier provide accident insurance to all Workers, covering medical treatment & compensation for work related accidents? YES
7 Are there routinesin place to ensure that applicable laws and regulations related to Legal requirements are implemented? YES
8 Does the supplier have all legal license/ certifications(Trade, Factory License, Fire license etc.) as applicable and prescribed by national laws? YES
9 Does the supplier have Building/Construction/Floor layout approval from the concerned Authority? PARTIAL
10 Does the factory have developed and implemented an anti corruption policy? Doesit clearly state that bribery & corruption are unacceptable? YES
11 Are the relevant documents, records, reports etc. are transparent, correct and reliable? YES
12 Are all applicable laws and regulations relating to emissions to air complied with and the necessary permits and test reports are obtained? YES
13 Does the factory have documented and implemented routinesfor purchasing, storage, handling of chemicals and emergency response? YES
14 Is there a complete list of all chemicals & Are the chemicalsstored in secondery containment with MSDS and labelling? YES
15 Are there documented routinesfor the handling,storing, transportation and disposal of hazardous and non-hazardous waste? YES
16 Is there a list of hazardous and non-hazardous waste & maintained in order to monitor the type & quantity of waste that is beinggenerated? YES
17 Is there sufficient emergency exits and routes to ensure a fast and safe evacuation of all Workers? YES
18 Is there sufficient emergency evacuation plan posted on the relevant placesin the floor? YES
19 Is there a functioning evacuation alarm to notify all Workers about an emergency situation in order to ensure a fast and safe evacuation? YES
20 Are there evacuation drills at least once in every 06 months that involve all shifts and departments and workers performed? YES
21 Has the facility done a risk assessment for the whole site and all its workplaces? YES
22 Are safety information and/or warning signs clearly visibly at risk areas? YES
23 Are there safe working routinesimplemented to minimize risk of injuries associated with hazardous work tasksi.e work at height etc? N/A
24 Are the risks and other occupational hazardsin the workplace that can cause an accident/injury acted on and minimized? YES
25 Are all the appropriate PPE available, used and provided free of charge for workersin any harmful or potentially risky work areas? YES
26 Are there first aid equipment & trained first aider available to workers as per legislation during all shiftsin all buildings and on each floor? YES
27 Does the company provide clean drinking water to all Workers on free of charge? YES
28 Does the company implement good housekeeping to ensure a hygienic and safe environment for workers? YES
29 Are there adequate arrangements where workers can rest and eat during their breaks? YES
30 Is there alcohol and drug control policy to restrain any work from being performed under the influence of alcohol, illegal drugs or any substance that prevents respective workersfrom performing their job safely and effectively? Isit communicated to and recognised by all employees? YES
31 Does the supplier have established and implemented transpent recruitment policy that enables recruitment without any discrimination? YES
32 Does the company sign a written employment contract with each worker before they start work? PARTIAL
33 Are the payroll, attendance records, payment of wages and working hours maintained for each worker? YES
34 Are the working hourslimited to maximum sixty (60) hours per week, including overtime? Are the overtime hours done on a voluntary basis? YES
35 Does every worker get at least one day off in seven? YES
36 Does the Supplier provide the Minimum wage as per gazette including compensation for overtime? YES
37 Are the workers paid on time at regular intervals and at least monthly? YES
38 Are the deductions made by company kept within 10% of the wages & do not result in a wage paid out that is below the legal minimum wage? YES
39 Are the workers provided with leave from their job according to applicable local legislation and standards? YES
40 Are the workers provided with all legally mandated benefitssuch as medical insurance, social insurance etc. to which they are entitled? YES
41 Are there routinesin practice on how to bring up issues and complaints regarding any issues e.g. discrimination, harassment or abuse? YES
42 Does the grievance routine include how all workers can bring up issues and complaints directly to the Supplier? YES
43 Are there routines describing preventive actions against harassment and abuse? Are the rulesfor disciplinary actions properly implemented? YES
44 Are the workers allowed to access toilets and drinking water stations anytime at their will? YES
45 Is there a hygienic canteen facility for the workers? YES
46 Are their sufficient fire fighting mechanism i.e. fire fighting & rescue team, fire fighting equipment, smoke detectors as applicable? YES
47 Are the Fire equipment checked for their efectiveness periodically and preserved the effective maintenance records? YES
48 Is there a policy for pregnant workers that provide for special arrangements on the job? YES
49 Does the company provide maternity leave and other benefits as prescribed by local law? YES
50 Is there a procedure in place to periodically evaluate the effectivenessfor identifying non-conformities & developing countermeasuresfor continual improvement? If so, are they properly documented? YES`;

const c = `1 Does the factory have accredited Quality Management System in place? ( If yes, please attach copy of Quality Management System Certificate) YES
2 Does the factory have a Quality Manual? YES
3 Doesfactory have Product Safety Compliance Certification? YES
4 Does the factory maintain records that all paints, non-paint components are tested for Lead and Heavy Metalscontent and complied with the safety & regulatory requirements where the products are sold as applicable? YES
5 Doesfactory have documented REACH document controlsystem? YES
6 Doesfactory implement sharp tools control procedure to prevent scissors, knives, blades and needles to be mixed with product? YES
7 Doesfactory have metal detecting unit located at the right finishing area? Isit enclosed and secured that have regular calibration records? YES
8 Does the factory implement Broken Needle & Broken glasses Policy? YES
9 Does the factory use any QC Tools / Reports / Improvement plans? YES
10 Does the factory have factory'sinspection plan & Defect Classification List? YES
11 Does the factory have a process to manage approved finished product samples, including maintenance and renewal? YES
12 Does detailed specification set up for individual product? N/A
13 Does the factory take any action to prevent rejected or non-comformance itemsfrom being misused in incoming material area, production area, packing area and packed goods warehouse? YES
14 Does the factory take any action to avoid deterioration of quality or safety for incoming materials, finished products and packed goods? YES
15 Does the factory have any procedure for ensuring traceability for materials, components, manufactured parts and finished goods? YES
16 Does the factory provide production line and packingline guidelines to ensure that relevant people can understand the production requirement? YES
17 Is the checkingLight Box being put under a proper environment, well maintained and approved shade band available for bulk color verification? YES
18 Does the supplier have Flow Chart of Incoming Materials Control, Production Process, In-house Lab test & Final Inspection? YES
19 Does the supplier have Organogram including Quality Department? Does the quality head have the authority to perform hisjob indepently? YES
20 Does the supplier perform inspection and testing at Incoming Stage, Processing Stage & Final Stage? YES
21 Does the supplier control Non-Conforming products? If yes, please describe how. YES
22 Have the supplier established & maintained a trainingsystem in place to provide awareness, skills and trainings to its personnel? NO
23 Does the supplier have a customer complaint System? YES
24 Does the supplier follow set of proceduresfor performing work? YES
25 Are existing machines adequate to produce required quality product? YES
26 Are storage areas / conditions adequate to safeguard the product against deterioration? YES
27 Are the management and workers committed to quality? YES
28 Does the supplier assess the product and process Risk? YES
29 Does the supplier follow written specifications / standards/work instruction? YES
30 Does the supplier perform machine maintenance & preserved the maintenance records? YES`;

const d = `1 Does the facility have a documented and communicated security management policy for supply chain security? YES
2 Does the facility have security management objectives that are implemented, maintained, documented, derived from and consistent with the security management policy? NO
3 Does the facility have security management targets that are implemented, maintained, documented, derived from and consistent with the security management objectives? YES
4 Does the facility have security management procedures established, implemented, maintained and documented for achievingsecurity management objectives and targets? YES
5 Is there a defined organizational structure of roles, responsibilities and authoritiesfor security management? YES
6 Are there proceduresfor ensuring that important security management information is communicated to and from relevant employees, contractors and other stakeholders? YES
7 Are there security management operational controlsin place to manage identified threats and risk in the supply chain and to achieve the security management policy objectives? YES
8 Does the supplier take over the security responsibilitiesin the part of supply chain under their accountability including cargo en route? YES
9 Are there proceduresin place for top management, at planned intervals, to evaluate the security management system to ensure its continuing suitability, adequacy and effectiveness? YES
10 Is there a documented procedure in place to respond during any emergency (sabotage, fire incident, natural disaster, chemical accident etc.) that hampers the integrity of the overallsecurity system? YES
11 Does the facility have written, verifiable processes and procedures used in the selection of business partners? NO
12 Does the facility incorporate and meet minimum supply chain security requirement i.e. Security Code of Conduct as communicated by ZZFL ? YES
13 Is there a procedure in place to prevent unauthorized access to a container or a trailer and/or product storage areas within the facility including whom to notify if any issue identified? YES
14 Does the supplier inspect the security integrity of a container or trailer prior to loading? YES
15 Is driver information recorded and retained for all departing cargo? YES
16 Is a written procedure in place instructing drivers to take designated routes between the supplier factory and the destination? YES
17 Does the contracted transportation company use container or trailer tracking technologies? YES
18 Is a written and verifiable security procedure in place with contracted less than container load (LCL)service providers? NO
19 Is there a procedure in place that requires an LCL container or trailer to be sealed after each stop with either a tamper evident seal or a padlock? YES
20 Is a written procedure in place that outlines access control to the facility, property and buildings? YES
21 Are access control procedures or devices used to ensure that only authorized personnel have access the facility? YES
22 Is there a written and verifiable procedure in place to monitor and limit access to critical operational areas of the facility,such as warehouse, final packing or packaging and shipping? YES
23 Is there a written and verifiable procedure in place that requires a visitor to present photo identification upon arrival and their information is recorded into a visitor logincluding entry and exit time? YES
24 Is there a written and verifiable procedure in place to inspect a suspicious package and mail for dangerous materials prior to distribution? YES
25 Are employees required to display their ID badge at all times while at the facility? YES
26 Is there a written and verifiable procedure in place to identify, challenge, and remove an unauthorized person at the facility? YES
27 Is there an employee hiring procedure documented and implemented? YES
28 If allowed by local law, is a written procedure in place to perform a background check on an applicant and employee who wo in sensitive area of the facility,such as personnel, shipping, computer systems? YES
29 Is a written procedure in place to remove facility access,such as a facility issued ID badge or computer access code from any employee who hasseparated, or takes an extended leave of absence? YES
30 Is there a designated employee and visitor vehicle parking area separated from the shipping and receiving area? PARTIAL
31 Does the shipping area have a fence, a wall, or other controlsseparating domestic, hazardous, high value, and international goods and materials? YES
32 Is there a preventative maintenance procedure in place that requires a regular inspection of perimeter fencing or other barriers and structures? YES
33 Are facility gates through which vehicles and/or employees enter and exit guarded or monitored and secured when not in use? YES
34 In the event of a power outage, does the facility have an alternate electrical power system to ensure uninterrupted operation of electronic security systems? YES
35 Are facility buildings constructed of materials that will resist easy illegal entry? YES
36 Are facility windows, gates, fences, and doorssecured with locking devices to deter unauthorized access? YES
37 Is there a written and verifiable procedure in place to control the issue, removal, and changing of access devicessuch an ID badge, door and lock keys, access cards, and security alarm codes? YES
38 Does the facility have sufficient lighting at entrances, exits, cargo handling and storage areas, alongfence lines, and in parking areas to detect movement during periods of darkness? YES
39 Does the facility have an anti-intrusion alarm system? YES
40 Is there a CCTV system used to monitor the facility and premises' including entrances, exits, cargo storage,shipping, and other loading/unloading areas? PARTIAL
41 Is there a procedure in place to test and inspect the CCTV system and does the factory keep back up for a certain period? YES
42 Is there a Security Threat Awareness training program established, maintained and communicated across the organization? YES
43 Does Threat Awareness traininginform employees of procedures to report suspicious activity or a security incident? YES
44 Does Threat Awareness training provide additional instruction to shipping and receiving employees regarding access cont container and trailer inspection, and security seal control procedures? YES
45 Does the training program include criteria critical to security programssuch as Terrorism, Narcotics, Smuggling, Human Trafficking etc.? YES
46 Is there a written information technology system security policy in place? YES
47 Do automated systems at the facility have individually assigned user accounts that require a periodic change of password? YES
48 Are written procedures and automated back-up capabilitiesin place to protect against the loss of data? YES
49 Are automated systemsin place to monitor for and prevent attempts of unauthorized access and tampering with systems and/or electronic data? YES
50 Are employees with computer systems access aware of and receive training about information technology system policies, procedures, and security standards; and is employee training documented and retained? YES`;

const makeItems = (txt, secIndex, sectionName) => {
    return txt.split('\n').filter(Boolean).map(h => {
        const match = h.match(/^(\d+)\s+(.*)\s+(YES|PARTIAL|NO|N\/A)$/);
        if (match) {
            let q = match[2].trim().replace(/'/g, "\\'");
            return `  { id: 'sup-${secIndex}-${match[1]}', clause: '${sectionName}', question: '${q}' }`;
        }
    }).filter(Boolean);
};

const items = [
    ...makeItems(a, 'a', 'Section-A: Supplier Background'),
    ...makeItems(b, 'b', 'Section-B: Social Compliance'),
    ...makeItems(c, 'c', 'Section-C: Quality System'),
    ...makeItems(d, 'd', 'Section-D: Security System')
];

let orig = fs.readFileSync('src/components/audit/isoQuestions.ts', 'utf8');
orig = orig.replace(/export const defaultSupplierQuestions: IsoQuestionTemplate\[\] = \[[\s\S]*?\];/, 
`export const defaultSupplierQuestions: IsoQuestionTemplate[] = [
${items.join(',\n')}
];`);

fs.writeFileSync('src/components/audit/isoQuestions.ts', orig);
console.log("Done");
