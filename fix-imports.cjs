const fs = require('fs');

const filesToFix = [
  'src/components/calibration/CalibrationModule.tsx',
  'src/components/certificate/CertificateModule.tsx',
  'src/components/incoming-qc/IncomingQCModule.tsx',
  'src/components/events/EventModule.tsx',
  'src/components/traceability/TraceabilityModule.tsx',
];

for(const file of filesToFix) {
  let content = fs.readFileSync(file, 'utf8');
  if(!content.includes('import { useApiStorage }')) {
      content = "import { useApiStorage } from '../../hooks/useApiData';\n" + content;
      fs.writeFileSync(file, content);
      console.log('Fixed:', file);
  }
}
