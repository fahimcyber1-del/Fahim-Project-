import { IsoQuestionTemplate } from './types';

export const defaultIsoQuestions: IsoQuestionTemplate[] = [
  { id: '1', clause: '4.1', question: 'How has the organization determined external and internal issues relevant to its purpose and strategic direction?' },
  { id: '2', clause: '4.1', question: 'How do you monitor and review information about these internal and external issues?' },
  { id: '3', clause: '4.2', question: 'How have you determined what interested parties are relevant to the QMS and their requirements?' },
  { id: '4', clause: '4.2', question: 'How do you monitor and review the information about interested parties and their relevant requirements?' },
  { id: '5', clause: '4.3', question: 'How have the boundaries and applicability of the QMS been used to establish the scope of the organization?' },
  { id: '6', clause: '4.3', question: 'Where is the scope available? Where is it maintained as documented information?' },
  { id: '7', clause: '4.4', question: 'How has the QMS been established? Show me how this is implemented, maintained, and continually improved.' },
  { id: '8', clause: '4.4', question: 'What are the inputs and outputs for those processes? What is the sequence and interaction?' },
  { id: '9', clause: '5.1.1', question: 'Show me how top management demonstrates leadership and commitment w.r.t. the QMS.' },
  { id: '10', clause: '5.1.2', question: 'Show me how top management demonstrates leadership and commitment w.r.t. customer focus.' },
  { id: '11', clause: '5.2.1', question: 'How does top management establish, review and maintain a quality policy?' },
  { id: '12', clause: '5.2.2', question: 'Where is the quality policy available as documented information and how is it communicated?' },
  { id: '13', clause: '5.3', question: 'How does top management ensure that responsibilities and authorities for relevant roles are assigned, communicated and understood?' },
  { id: '14', clause: '6.1.1', question: 'How are the internal and external issues and interested parties considered when planning for the QMS?' },
  { id: '15', clause: '6.1.2', question: 'How are actions planned to address risks and opportunities?' },
  { id: '16', clause: '6.2.1', question: 'Where are the quality objectives and are these at all relevant functions, levels and processes?' },
  { id: '17', clause: '6.3', question: 'How are changes to the QMS planned systematically?' },
  { id: '18', clause: '7.1.1', question: 'Demonstrate how resources are determined for the establishment, implementation, maintenance and continual improvement of the QMS.' },
  { id: '19', clause: '7.1.5', question: 'How are the resources determined for ensuring valid and reliable monitoring and measuring results?' },
  { id: '20', clause: '7.2', question: 'How do you determine the necessary competence of people doing work under your control?' },
  { id: '21', clause: '7.3', question: 'How are people aware of the quality policy, relevant quality objectives, and their contribution to the QMS?' },
  { id: '22', clause: '7.4', question: 'How do you determine internal and external communications relevant to the QMS?' },
  { id: '23', clause: '7.5.1', question: 'What documented information do you have as required by this standard?' },
  { id: '24', clause: '8.1', question: 'How are processes needed to meet requirements for provision of products and services planned, implemented and controlled?' },
  { id: '25', clause: '8.2.1', question: 'What are your processes for communicating with customers?' },
  { id: '26', clause: '8.3.2', question: 'When determining the stages and control for design and development, show me how you consider the nature, duration and complexity.' },
  { id: '27', clause: '8.4.1', question: 'How do you ensure externally provided processes, products and services conform to specified requirements?' },
  { id: '28', clause: '8.5.1', question: 'What controlled conditions do you have for production and service provision, including delivery and post-delivery activities?' },
  { id: '29', clause: '8.7', question: 'How do you identify and control process outputs, products and services that do not conform to requirements?' },
  { id: '30', clause: '9.1.1', question: 'Show me how you determine what needs to be monitored and measured, and the methods for it.' },
  { id: '31', clause: '9.1.2', question: 'How do you monitor customer perception of the degree to which requirements have been met?' },
  { id: '32', clause: '9.2.1', question: 'Are internal audits being conducted at planned intervals? Do they determine whether the QMS conforms to ISO 9001?' },
  { id: '33', clause: '9.3.1', question: 'What is the frequency that top management reviews the organization\'s QMS?' },
  { id: '34', clause: '10.1', question: 'How do you determine and select opportunities for improvement? What necessary actions have you implemented?' },
  { id: '35', clause: '10.2.1', question: 'When nonconformities occur, show me how you react, evaluate, and implement corrective actions.' },
  { id: '36', clause: '10.3', question: 'Demonstrate that you continually improve the suitability, adequacy and effectiveness of the QMS.' }
];

export const defaultSupplierQuestions: IsoQuestionTemplate[] = [
  { id: 'sup-1', clause: '1.0', question: 'Does the supplier have a valid business license and required legal registrations?' },
  { id: 'sup-2', clause: '2.0', question: 'Does the facility have adequate capacity to meet production requirements?' },
  { id: 'sup-3', clause: '3.0', question: 'Is there a dedicated Quality Control team in place?' },
  { id: 'sup-4', clause: '4.0', question: 'Are incoming materials properly inspected and documented?' },
  { id: 'sup-5', clause: '5.0', question: 'Is there a corrective action process for identified defects?' }
];
