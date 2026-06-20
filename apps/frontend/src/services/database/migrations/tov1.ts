import tov1_sql from "@/services/database/sql/migrations/tov1.sql";
import { SQLiteDatabase } from "expo-sqlite";

export const toV1 = async (db: SQLiteDatabase) => {
  await db.execAsync(tov1_sql);
};
