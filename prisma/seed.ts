import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';

const prismaClient = new PrismaClient();

const seedEditTypes = async () => {
  const logTypes: string[] = ['FLOOR', 'ROOM', 'USER', 'ROOM_IMAGES'];

  for (const logType of logTypes) {
    await prismaClient.logType.upsert({
      where: { type: logType },
      update: {},
      create: { type: logType },
    });
  }

  console.log('Log Types Seeded.');
};

const seedEditMethods = async () => {
  const logMethods: string[] = [
    'CREATE',
    'UPDATE',
    'SOFT_DELETE',
    'DELETE',
    'RETRIEVE',
  ];

  for (const logMethod of logMethods) {
    await prismaClient.logMethod.upsert({
      where: { method: logMethod },
      update: {},
      create: { method: logMethod },
    });
  }

  console.log('Log Method Seeded.');
};

const seedDivision = async () => {
  const divisions = [
    { code: 'ADM', name: 'Admin Division' },
    { code: 'ANC', name: 'Ancillary Division' },
    { code: 'NSD', name: 'Nursing Services Division' },
  ];

  for (const division of divisions) {
    await prismaClient.division.upsert({
      where: { code: division.code },
      update: {},
      create: division,
    });
  }
};

const seedItems = async () => {
  const items = [
    { description: 'Paracetamol 500mg Tablet', price: 5 },
    { description: 'Amoxicillin 250mg Capsule', price: 8 },
    { description: 'Cefuroxime Injection 750mg', price: 120 },
    { description: 'Ibuprofen 400mg Tablet', price: 6 },
    { description: 'Mefenamic Acid 500mg Capsule', price: 7 },
    { description: 'Omeprazole 20mg Capsule', price: 10 },
    { description: 'Metformin 500mg Tablet', price: 9 },
    { description: 'Losartan 50mg Tablet', price: 8 },
    { description: 'Amlodipine 5mg Tablet', price: 7 },
    { description: 'Captopril 25mg Tablet', price: 6 },
    { description: 'Salbutamol Nebule 2.5mg/2.5mL', price: 15 },
    { description: 'Insulin NPH 100 IU/mL', price: 300 },
    { description: 'Insulin Glargine', price: 600 },
    { description: 'Hydrochlorothiazide 25mg Tablet', price: 5 },
    { description: 'Metoprolol 50mg Tablet', price: 6 },
    { description: 'Simvastatin 20mg Tablet', price: 10 },
    { description: 'Atorvastatin 10mg Tablet', price: 12 },
    { description: 'Prednisone 10mg Tablet', price: 5 },
    { description: 'Cetirizine 10mg Tablet', price: 7 },
    { description: 'Loratadine 10mg Tablet', price: 8 },
    { description: 'Clopidogrel 75mg Tablet', price: 15 },
    { description: 'Warfarin 5mg Tablet', price: 12 },
    { description: 'Multivitamins Tablet', price: 5 },
    { description: 'Ferrous Sulfate 325mg Tablet', price: 6 },
    { description: 'Calcium Carbonate + Vitamin D', price: 10 },
    { description: 'Vitamin B Complex', price: 8 },
    { description: 'X-ray Chest PA View', price: 250 },
    { description: 'MRI Brain with Contrast', price: 4500 },
    { description: 'Ultrasound – Whole Abdomen', price: 900 },
    { description: 'CT Scan – Head', price: 3500 },
    { description: '2D Echo', price: 1200 },
    { description: 'ECG (Electrocardiogram)', price: 300 },
    { description: 'CBC (Complete Blood Count)', price: 150 },
    { description: 'Creatinine Test', price: 100 },
    { description: 'Fasting Blood Sugar', price: 120 },
    { description: 'Lipid Profile', price: 500 },
    { description: 'Urinalysis', price: 90 },
    { description: 'Fecalysis', price: 90 },
    { description: 'HBA1C Test', price: 600 },
    { description: 'Blood Typing', price: 180 },
    { description: 'IV Infusion D5LR', price: 90 },
    { description: 'Nebulization Service', price: 200 },
    { description: 'Physical Therapy - Session', price: 500 },
    { description: 'Dialysis Session', price: 2500 },
    { description: 'Anti-Tetanus Shot', price: 250 },
    { description: 'Hepatitis B Vaccine', price: 450 },
    { description: 'Rabies Vaccine', price: 1200 },
    { description: 'COVID-19 RT-PCR Test', price: 3500 },
    { description: 'Rapid Antigen Test', price: 700 },
    { description: 'Chest CT Scan', price: 4000 },
    { description: 'Bone Scan', price: 3000 },
    { description: 'Urine Drug Test (5 panel)', price: 600 },
    { description: 'HCG Pregnancy Test', price: 100 },
    { description: 'Papsmear', price: 300 },
    { description: 'Mammogram', price: 800 },
    { description: 'Colonoscopy', price: 5000 },
    { description: 'Gastroscopy', price: 4000 },
    { description: 'Tooth Extraction', price: 700 },
    { description: 'Dental Cleaning', price: 500 },
    { description: 'Dental Filling', price: 1000 },
    { description: 'Eye Checkup - Basic', price: 250 },
    { description: 'Hearing Test (Audiometry)', price: 400 },
    { description: 'Blood Transfusion', price: 2000 },
    { description: 'IV Insertion', price: 150 },
    { description: 'Wound Dressing', price: 200 },
    { description: 'Cast Application', price: 800 },
    { description: 'Minor Surgery - Cyst Removal', price: 2500 },
    { description: 'Major Surgery - Appendectomy', price: 25000 },
    { description: 'Consultation - General Physician', price: 300 },
    { description: 'Consultation - Cardiologist', price: 500 },
    { description: 'Consultation - Pulmonologist', price: 500 },
    { description: 'Consultation - Surgeon', price: 500 },
    { description: 'Admission - General Ward (per day)', price: 1200 },
    { description: 'Admission - Private Room (per day)', price: 3000 },
    { description: 'Admission - ICU (per day)', price: 7000 },
    { description: 'Oxygen Therapy (per hour)', price: 100 },
    { description: 'Suture Removal', price: 150 },
    { description: 'Blood Culture', price: 400 },
    { description: 'Thyroid Profile', price: 700 },
    { description: 'Liver Function Test', price: 600 },
    { description: 'Kidney Function Test', price: 600 },
    { description: 'Stool Occult Blood Test', price: 150 },
    { description: 'VDRL Test', price: 200 },
    { description: 'HIV Test', price: 300 },
    { description: 'Dengue NS1 Test', price: 500 },
    { description: 'Malaria Smear', price: 250 },
    { description: 'PT/INR Test', price: 450 },
    { description: 'Bleeding Time / Clotting Time', price: 200 },
    { description: 'Sputum AFB Test', price: 150 },
    { description: 'EEG (Electroencephalogram)', price: 1500 },
    { description: 'EMG (Electromyography)', price: 2000 },
    { description: 'Skin Allergy Test', price: 1000 },
    { description: 'Flu Vaccine', price: 400 },
    { description: 'Tetanus Toxoid Injection', price: 200 },
    { description: 'IV Antibiotic Administration', price: 150 },
    { description: 'Pain Management Consultation', price: 500 },
    { description: 'Nutritionist Consultation', price: 400 },
    { description: 'Smoking Cessation Counseling', price: 300 },
  ];

  const departmentIds = [3, 7, 11, 12, 14, 15, 19, 20, 21, 22, 23, 24];

  const getRandomDeptId = () =>
    departmentIds[Math.floor(Math.random() * departmentIds.length)];

  for (const item of items) {
    try {
      await prismaClient.item.create({
        data: {
          ...item,
          deptId: getRandomDeptId(),
        },
      });
    } catch (error) {
      console.warn(`Skipping duplicate item: ${item.description}`);
      console.error(error);
    }
  }

  console.log('100+ hospital items and medicines seeded.');
};

const seedDepartments = async () => {
  const departments = [
    { name: 'Human Resource', code: 'HR', divisionId: 1 },
    {
      name: 'Quality Management',
      code: 'QM',
      divisionId: 1,
    },
    {
      name: 'Information Technology',
      code: 'IT',
      divisionId: 1,
    },
    { name: 'Marketing', code: 'MRKT', divisionId: 1 },
    { name: 'Accounting', code: 'ACNT', divisionId: 1 },
    { name: 'Ancillary', code: 'ANC', divisionId: 1 },
    {
      name: 'Nursing Services Department',
      code: 'NSD',
      divisionId: 3,
    },
    { name: 'Supply Chain', code: 'SC', divisionId: 1 },
    {
      name: 'Support Services',
      code: 'SSD',
      divisionId: 1,
    },
    {
      name: 'Customer Experience',
      code: 'CED',
      divisionId: 1,
    },
    { code: 'OR', name: 'Operating Room', divisionId: 3 },
    { code: 'ER', name: 'Emergency Room', divisionId: 3 },
    { code: 'NICU', name: 'Nicu', divisionId: 3 },
    { code: 'DIA', name: 'Dialysis', divisionId: 3 },
    { code: 'ICU', name: 'Icu', divisionId: 3 },
    { code: 'ACU', name: 'Acu', divisionId: 3 },
    {
      code: 'GNU4F',
      name: '4th Floor Ward',
      divisionId: 3,
    },
    {
      code: 'GNU5F',
      name: '5th Floor Ward',
      divisionId: 3,
    },
    { code: 'IMGN', name: 'Imaging', divisionId: 2 },
    { code: 'CRD', name: 'Cardiology', divisionId: 2 },
    { code: 'PULM', name: 'Pulmonary', divisionId: 2 },
    {
      code: 'PMR',
      name: 'Physical, Medicine, and Rehab',
      divisionId: 2,
    },
    { code: 'LAB', name: 'Laboratory', divisionId: 2 },
    { code: 'DIET', name: 'Dietary', divisionId: 2 },
  ];

  for (const department of departments) {
    await prismaClient.department.upsert({
      where: { code: department.code },
      update: {},
      create: department,
    });
  }

  console.log('Department seeded.');
};

const seedQuestions = async () => {
  const questions: string[] = [
    'What was the name of your first pet?',
    "What is your mother's maiden name?",
    'What was the name of your first school?',
    'In what city were you born?',
    'What is the name of your favorite childhood teacher?',
    'What is your favorite movie?',
    'What was your childhood nickname?',
    'What is your favorite book?',
    'What is your favorite food?',
    'What is the name of the street you grew up on?',
    'What was your first car?',
    'Who was your childhood best friend?',
    'What is your favorite vacation destination?',
    'What was the name of your first stuffed animal?',
    'What is the middle name of your oldest sibling?',
    'What was the name of your first boss?',
    'What is your favorite sports team?',
    'What is the name of the first concert you attended?',
    'What is the name of your first crush?',
    'What was your dream job as a child?',
  ];

  questions.map(async (question) => {
    await prismaClient.secretQuestion.create({ data: { question } });
  });

  console.log('Questions seeded.');
};

const seedUsers = async () => {
  const users = [
    {
      firstName: 'Niel',
      lastName: 'Marketing',
      employeeId: '00001111',
      deptId: 4,
    },
    {
      firstName: 'Aldrin',
      lastName: 'Gabrido',
      employeeId: '00001112',
      deptId: 8,
    },
    {
      firstName: 'Jonathan',
      lastName: 'Quebral',
      employeeId: '00001113',
      deptId: 3,
    },
  ];

  for (const user of users) {
    const hashedPassword = await argon.hash('abcd_123');

    await prismaClient.user.create({
      data: { ...user, password: hashedPassword },
    });
  }

  console.log('User seeded.');
};

const main = async () => {
  await seedEditMethods();
  await seedEditTypes();
  await seedDivision();
  await seedDepartments();
  await seedUsers();
  await seedQuestions();
  await seedItems();
};

main().catch((err) => console.error(err));
