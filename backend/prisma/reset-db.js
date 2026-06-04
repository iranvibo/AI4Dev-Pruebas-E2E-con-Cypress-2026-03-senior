const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const position = await prisma.position.findFirst({
    where: { title: 'Desarrollador Full Stack' },
    include: {
      interviewFlow: {
        include: {
          interviewSteps: true
        }
      }
    }
  });

  const candidate = await prisma.candidate.findFirst({
    where: { firstName: 'Juan', lastName: 'Pérez' }
  });

  if (position && candidate) {
    const stepAplicados = position.interviewFlow.interviewSteps.find(s => s.name === 'Aplicados');
    if (stepAplicados) {
      await prisma.application.updateMany({
        where: {
          positionId: position.id,
          candidateId: candidate.id
        },
        data: {
          currentInterviewStep: stepAplicados.id
        }
      });
      console.log('Reset test data successfully');
    } else {
      console.error('Could not find Aplicados step');
    }
  } else {
    console.error('Could not find position or candidate');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
