type DAYS = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
type DAYS_ES = "Lunes" | "Martes" | "Miércoles" | "Jueves" | "Viernes" | "Sábado" | "Domingo";

type User = {
  user_id: string;
  created_at?: string;
  updated_at?: string;
  training_plans: TrainingPlan[];
  meal_plans?: MealPlan[];
}

type TrainingPlan = {
  id: string;
  start_date: string;
  end_date: string;
  weekly_progress: Week[];
}

type Week = {
  week_number: number;
  days: Day[];
}

type Day = {
  day_en: DAYS;
  day_es: DAYS_ES;
  activities: Activity[];
}

type Activity = {
  type: ActivityType;
  exercises: Exercise[];
}

type Exercise = {
  name: string;
  rounds?: string;
  reps?: string;
  sets?: string;
  weight?: number;
  duration?: number;
  intensity?: number;
  work_interval?: string;
  rest_interval?: string;
  RPE?: string;
  notes?: string;
}

type ActivityType = "Mobility" | "Weightlifting" | "Cardio" | "Tabata";

type MealPlan = {
  id: string;
  start_date: string;
  end_date: string;
  days: MealDay[];
}

type MealDay = {
  day_en: DAYS;
  day_es: DAYS_ES;
  meals: Meal[];
}

type Meal = {
  name: string;
  type: MealType;
  ingredients: Ingredient[];
}

type Ingredient = {
  name: string;
  quantity: string;
  unit: string;
}

type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";

type Recipe = {
  id: string;
  name: string;
  ingredients: Ingredient[];
  steps: string[];
}

export type { User, TrainingPlan, Week, Day, Activity, Exercise, ActivityType, MealPlan, MealDay, Meal, Ingredient, MealType, Recipe };
