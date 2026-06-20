import { type SQLiteDatabase } from "expo-sqlite";
import { toV1 } from "./migrations/tov1";

export async function initDB(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;

  let { user_version: currentVersion } = (await db.getFirstAsync<{
    user_version: number;
  }>("PRAGMA user_version")) ?? { user_version: 0 };

  if (currentVersion >= DATABASE_VERSION) return;

  switch (currentVersion) {
    case 0:
      await toV1(db);
      currentVersion = 1;
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
