import deleteByUidSql from "../sql/things/deleteByUID.sql";
import insertSql from "../sql/things/insert.sql";
import searchByNameSql from "../sql/things/searchByName.sql";
import selectAllSql from "../sql/things/selectAll.sql";
import selectByUidSql from "../sql/things/selectByUID.sql";

import { SQLiteDatabase, openDatabaseAsync } from "expo-sqlite";
import { TThing } from "../types";

export const ThingsRepo = {
  insert: async (
    db: SQLiteDatabase,
    data: {
      uid: string;
      name: string;
      imageURI: string;
      latitude: number;
      longitude: number;
    },
  ) => {
    try {
      const result = await db.runAsync(insertSql, [
        data.uid,
        data.name,
        data.imageURI,
        data.latitude,
        data.longitude,
      ]);

      return result;
    } catch (error: any) {
      if (error?.message?.includes("closed resource")) {
        console.warn(
          "things-repo.ts => insert: Database is closed. Attempting to reopen and retry...",
        );
        try {
          const freshDb = await openDatabaseAsync("findmythings.db");
          return await freshDb.runAsync(insertSql, [
            data.uid,
            data.name,
            data.imageURI,
            data.latitude,
            data.longitude,
          ]);
        } catch (retryError) {
          console.error(
            "things-repo.ts => insert: Retry failed",
            retryError,
          );
        }
      } else {
        console.error("things-repo.ts => insert:", error);
      }

      return null;
    }
  },
  selectByUid: async (db: SQLiteDatabase, uid: string) => {
    try {
      const result = await db.getFirstAsync<TThing>(selectByUidSql, [uid]);

      return result;
    } catch (error) {
      console.error("things-repo.ts => selectByUid:", error);

      return null;
    }
  },
  selectAll: async (db: SQLiteDatabase) => {
    try {
      if (!db) {
        throw new Error("Database instance is null");
      }

      const result = await db.getAllAsync<TThing>(selectAllSql);

      return result;
    } catch (error: any) {
      if (error?.message?.includes("closed resource")) {
        console.warn(
          "things-repo.ts => selectAll: Database is closed. Attempting to reopen and retry...",
        );
        try {
          const freshDb = await openDatabaseAsync("findmythings.db");
          return await freshDb.getAllAsync<TThing>(selectAllSql);
        } catch (retryError) {
          console.error(
            "things-repo.ts => selectAll: Retry failed",
            retryError,
          );
        }
      } else {
        console.error("things-repo.ts => selectAll:", error);
      }

      return [];
    }
  },
  searchByName: async (db: SQLiteDatabase, query: string) => {
    try {
      const result = await db.getAllAsync<TThing>(searchByNameSql, [
        `%${query}%`,
      ]);

      return result;
    } catch (error: any) {
      if (error?.message?.includes("closed resource")) {
        console.warn(
          "things-repo.ts => searchByName: Database is closed. Attempting to reopen and retry...",
        );
        try {
          const freshDb = await openDatabaseAsync("findmythings.db");
          return await freshDb.getAllAsync<TThing>(searchByNameSql, [
            `%${query}%`,
          ]);
        } catch (retryError) {
          console.error(
            "things-repo.ts => searchByName: Retry failed",
            retryError,
          );
        }
      } else {
        console.error("things-repo.ts => searchByName:", error);
      }

      return [];
    }
  },
  deleteByUid: async (db: SQLiteDatabase, uid: string) => {
    try {
      const result = await db.runAsync(deleteByUidSql, [uid]);

      return result.changes > 0;
    } catch (error) {
      console.error("things-repo.ts => deleteByUid:", error);

      return false;
    }
  },
};
