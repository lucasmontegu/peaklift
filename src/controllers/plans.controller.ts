import { prisma } from "@/lib/db";
import { Prisma, TrainingPlan, Week, Day, Activity } from '@prisma/client';


export const runtime = "nodejs";

type ActivityCreateInput = Prisma.ActivityCreateInput & {
  details: Record<string, any>;
};

type DayCreateInput = Prisma.DayCreateInput & {
  activities: ActivityCreateInput[];
};

type WeekCreateInput = Prisma.WeekCreateInput & {
  days: DayCreateInput[];
};

type TrainingPlanCreateInput = {
  userId: string;
  startDate: Date | string;
  endDate: Date | string;
  weeks: WeekCreateInput[];
};

async function createTrainingPlan(data: TrainingPlanCreateInput): Promise<TrainingPlan> {
  console.log("Creating training plan with data: ", data);
  const training_plan = await prisma.trainingPlan.create({
    data: {
      userId: data.userId,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      weeks: {
        create: data.weeks,
      },
    },
  });

  console.log("Created training plan: ", training_plan)

  return training_plan;
}

async function getTrainingPlanById(id: string): Promise<TrainingPlan | null> {
  const trainingPlan = await prisma.trainingPlan.findUnique({
    where: { id },
    include: {
      weeks: {
        include: {
          days: true, // Cambia a include: { activities: true } para incluir actividades
        },
      },
    },
  });

  return trainingPlan;
}

async function updateTrainingPlan(id: string, newStartDate: Date | string, newEndDate: Date | string): Promise<TrainingPlan> {
  const updatedTrainingPlan = await prisma.trainingPlan.update({
    where: { id },
    data: {
      startDate: new Date(newStartDate),
      endDate: new Date(newEndDate),
    },
  });

  return updatedTrainingPlan;
}

async function deleteTrainingPlan(id: string): Promise<TrainingPlan> {
  const deletedTrainingPlan = await prisma.trainingPlan.delete({
    where: { id },
  });

  return deletedTrainingPlan;
}

async function updateActivityDetails(activityId: string, updatedDetails: any): Promise<Activity> {
  const activity = await prisma.activity.findUnique({
    where: { id: activityId },
  });

  if (!activity) {
    throw new Error('Activity not found');
  }

  const newDetails = { ...activity.details as object, ...updatedDetails };

  const updatedActivity = await prisma.activity.update({
    where: { id: activityId },
    data: { details: newDetails },
  });

  return updatedActivity;
}

export {
  createTrainingPlan,
  getTrainingPlanById,
  updateTrainingPlan,
  deleteTrainingPlan,
  updateActivityDetails,
};