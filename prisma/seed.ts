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
};

main().catch((err) => console.error(err));
